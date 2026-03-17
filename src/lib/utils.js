export function formatPrice(price) {
    if (price === undefined || price === null) return '₹0.00';
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(price).replace(/^(\D+)/, '$1 '); // Add space after symbol if needed
}
