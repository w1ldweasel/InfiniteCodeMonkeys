document.addEventListener('DOMContentLoaded', () => {
    const consentSection = document.getElementById('consentSection');
    const termsAcceptance = document.getElementById('termsAcceptance');
    const acceptTermsButton = document.getElementById('acceptTerms');
    const declineTermsButton = document.getElementById('declineTerms');

    // Disable the accept button initially
    acceptTermsButton.disabled = true;

    // Enable the accept button when the terms are accepted
    termsAcceptance.addEventListener('change', () => {
        acceptTermsButton.disabled = !termsAcceptance.checked;
    });

    acceptTermsButton.addEventListener('click', () => {
        if (termsAcceptance.checked) {
            localStorage.setItem('termsAccepted', 'true');
            window.location.href = 'index.html'; // Redirect to the main application page
        } else {
            alert('You must agree to the terms to use this service.');
        }
    });

    declineTermsButton.addEventListener('click', () => {
        alert('You must agree to the terms to use this service.');
    });
});