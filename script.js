document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('tryAgain').addEventListener('click', () => {
        window.location.href = 'landing.html';
    });
    
    const confirmAction = document.getElementById('confirmAction');
    const cancelAction = document.getElementById('cancelAction');
    checked = new Boolean(false);

    confirmAction.addEventListener('click', () => {
        checked = true;
    });

    cancelAction.addEventListener('click', () => {
        alert('You must agree to the terms to use this service.');
        confirmationSection.style.display = 'block';
    })

    if (!checked) {
        console.log("page reloading");
        // window.location.href = 'landing.html'; // Redirect to the landing page for consent
    } else {
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
       
        function transactionExists(item, amount, date) {
            return transactions.some(transaction => transaction.item === item && transaction.amount === amount && transaction.date === date);
        }
        const newTransactions = [
            {
                item: "Henry Hoover",
                amount: 150.05,
                date: new Date('2024-12-02').toISOString().split('T')[0]
            },
            {
                item: 'Power Bank',
                amount: 10.49,
                date: new Date('2024-12-03').toISOString().split('T')[0]
            }
        ];
        
        newTransactions.forEach(newTransaction => {
            if (!transactionExists(newTransaction.item, newTransaction.amount, newTransaction.date)) {
                transactions.push(newTransaction);
            }
        });
        
        localStorage.setItem('transactions', JSON.stringify(transactions));
        
        const chartData = {
            labels: ['Money In', 'Money Out'],
            datasets: [{
                data: [2, transactions.length], // Initial data
                backgroundColor: ['#28a745', '#ff6384'],
                hoverBackgroundColor: ['#218838','#c82333']
            }]
        };

        const ctx = document.getElementById('spendingChart').getContext('2d');
        const spendingChart = new Chart(ctx, {
            type: 'doughnut',
            data: chartData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Transaction Count'
                    }
                }
            }
        });

        // const whatAreYouBuyingSection = document.getElementById('whatAreYouBuyingSection');
        const confirmationSection = document.getElementById('confirmationSection');
        const transactionHistorySection = document.getElementById('transactionHistorySection');
        const transactionHistory = document.getElementById('transactionHistory');
        const confirmationMessage = document.getElementById('confirmationMessage');
        const visualizationSection = document.getElementById('visualizationSection');

        // document.getElementById('whatAreYouBuyingForm').addEventListener('submit', function (event) {
        //     event.preventDefault();
        //     const item = document.getElementById('item').value;
        //     const amount = parseFloat(document.getElementById('amount').value);

        //     if (!item || isNaN(amount) || amount <= 0) {
        //         alert('Please enter valid item and amount.');
        //         return;
        //     }

        //     whatAreYouBuyingSection.style.display = 'none';
        //     confirmationSection.style.display = 'block';
        //     confirmationSection.dataset.item = item;
        //     confirmationSection.dataset.amount = amount;
        //     confirmationMessage.textContent = `£${amount}  - Amazon (Reason of purchase: ${item})`;
        // });

        document.getElementById('confirmAction').addEventListener('click', () => {
            console.log('adding item!');
            const item = 'Wilson Tennis Racket'; // confirmationSection.dataset.item;
            const amount = 69.99; // parseFloat(confirmationSection.dataset.amount);

            const transaction = {
                item,
                amount,
                date: new Date().toISOString().split('T')[0]
            };

            transactions.push(transaction);
            localStorage.setItem('transactions', JSON.stringify(transactions));
            updateChartData();
            displayTransactionHistory();

            confirmationSection.style.display = 'none';
            transactionHistorySection.style.display = 'block';
            visualizationSection.style.display = 'block';
            document.getElementById('tryAgain').style.display = 'block';

        });

        document.getElementById('exportCSV').addEventListener('click', () => {
            const csvContent = transactions.map(t => `${t.date},${t.item},${t.amount}`).join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', 'transactions.csv');
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            console.log('Exported csv data');
        });

        document.getElementById('clearCSV').addEventListener('click', () => {
            localStorage.removeItem('transactions');
            transactions.length = 0;
            displayTransactionHistory();
            updateChartData();
            alert('Transactions have been cleared.');
        });

        // function displayTransactionResult(message) {
        //     const resultDiv = document.createElement('div');
        //     resultDiv.textContent = message;
        //     transactionHistorySection.appendChild(resultDiv);
        // }

        function displayTransactionHistory() {
            transactionHistory.innerHTML = '';

            const table = document.createElement('table');
            const thead = document.createElement('thead');
            const tbody = document.createElement('tbody');

            const headerRow = document.createElement('tr');
            const headers = ['Date', 'Item', 'Amount'];
            headers.forEach(headerText => {
                const th = document.createElement('th');
                th.textContent = headerText;
                headerRow.appendChild(th);
            });

            thead.appendChild(headerRow);
            table.appendChild(thead);

            transactions.forEach(transaction => {
                const row = document.createElement('tr');
                const cells = [transaction.date, transaction.item, `£${transaction.amount}`];
                cells.forEach(cellText => {
                    const td = document.createElement('td');
                    td.textContent = cellText;
                    row.appendChild(td);
                });
                row.title = `Hovered over tracsaction: ${transaction.item} - £${transaction.amount}`;
                tbody.appendChild(row);
            });

            table.appendChild(tbody);
            transactionHistory.appendChild(table);
            console.log('Transaction table loaded');
        }

        function updateChartData() {
            chartData.datasets[0].data = [2, transactions.length];
            spendingChart.update();
            console.log('Updating Chart data');
        }

    }
});