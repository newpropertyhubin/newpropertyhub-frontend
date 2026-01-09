console.log("emi.js loaded");

document.getElementById("emiForm")?.addEventListener("submit", function(e){
    e.preventDefault();
    const P = parseFloat(document.getElementById("loanAmount").value);
    const R = parseFloat(document.getElementById("interestRate").value) / 12 / 100;
    const N = parseFloat(document.getElementById("tenure").value) * 12;

    if (!P || !R || !N || P <= 0 || R <= 0 || N <= 0) {
        document.getElementById("emiResult").textContent = "Please enter valid details.";
        return;
    }

    const emi = (P * R * Math.pow(1+R, N)) / (Math.pow(1+R, N) - 1);

    if (isFinite(emi)) {
        document.getElementById("emiResult").textContent = `Monthly EMI: ₹${emi.toFixed(2)}`;
    }
});