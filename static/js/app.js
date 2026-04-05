let spendingChart = null;

document.addEventListener('DOMContentLoaded', () => {
    fetchExpenses();
    fetchSummary();

    const form = document.getElementById('expense-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        let actualDate = document.getElementById('date').value;
        if (!actualDate || actualDate.length > 10) {
             actualDate = new Date().toISOString().split('T')[0];
        }

        const expenseData = {
            amount: parseFloat(document.getElementById('amount').value),
            category: document.getElementById('category').value,
            description: document.getElementById('description').value,
            date: actualDate
        };

        try {
            const response = await fetch('/api/expenses/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(expenseData)
            });

            if (response.ok) {
                form.reset();
                fetchExpenses();
                fetchSummary();
            }
        } catch (error) {
            console.error('Error adding expense:', error);
        }
    });
});

async function fetchExpenses() {
    try {
        const response = await fetch('/api/expenses/');
        const expenses = await response.json();
        renderTable(expenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);
    }
}

async function fetchSummary() {
    try {
        const response = await fetch('/api/summary/');
        const summary = await response.json();

        document.getElementById('total-amount').textContent = `$${summary.total.toFixed(2)}`;
        document.getElementById('transaction-count').textContent = summary.count;

        const categories = Object.keys(summary.by_category);
        if (categories.length > 0) {
            const topCat = categories.reduce((a, b) => summary.by_category[a] > summary.by_category[b] ? a : b);
            document.getElementById('top-category').textContent = topCat;
            document.getElementById('top-category-amount').textContent = `$${summary.by_category[topCat].toFixed(2)}`;
        } else {
            document.getElementById('top-category').textContent = 'N/A';
            document.getElementById('top-category-amount').textContent = '$0.00';
        }

        updateChart(summary.by_category);
    } catch (error) {
        console.error('Error fetching summary:', error);
    }
}

function renderTable(expenses) {
    const body = document.getElementById('expenses-body');
    body.innerHTML = '';

    // Sort by date descending
    expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

    expenses.forEach(expense => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${expense.date}</td>
            <td><span class="category-tag">${expense.category}</span></td>
            <td>${expense.description || '-'}</td>
            <td class="text-right">$${expense.amount.toFixed(2)}</td>
            <td>
                <button class="delete-btn" onclick="deleteExpense(${expense.id})">
                    <i data-lucide="trash-2"></i>
                </button>
            </td>
        `;
        body.appendChild(row);
    });

    try {
        lucide.createIcons();
    } catch(e) {
        console.error("Lucide icon error", e);
    }
}

async function deleteExpense(id) {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    try {
        const response = await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
        if (response.ok) {
            fetchExpenses();
            fetchSummary();
        }
    } catch (error) {
        console.error('Error deleting expense:', error);
    }
}

function updateChart(data) {
    const ctx = document.getElementById('spendingChart').getContext('2d');

    const labels = Object.keys(data);
    const values = Object.values(data);

    if (spendingChart) {
        spendingChart.destroy();
    }

    if (labels.length === 0) {
        return; // Don't try to render empty chart
    }

    spendingChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: [
                    '#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'
                ],
                borderWidth: 0,
                hoverOffset: 20
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: '#a0a0b0',
                        font: { family: 'Outfit', size: 14 },
                        padding: 20,
                        usePointStyle: true
                    }
                }
            },
            cutout: '70%',
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    });
}
