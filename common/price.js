const _MS_PER_DAY = 1000 * 60 * 60 * 24;

function applyDiscounts(price, discounts) {
    if (discounts) {
        for (const discount of discounts) {
            if (discount.type === 'percentage') {
                price *= 1 - discount.value;
            } else if (discount.type === 'fixed') {
                price -= discount.value;
            } else {
                return price;
            }
        }
    }

    return price;
}

function dateRangePrice(dateRange, discounted) {
    const from = new Date(dateRange.from)
    const to = new Date(dateRange.to)

    const nDays = Math.round((to.getTime() - from.getTime()) / _MS_PER_DAY) + 1;
    let totalPrice = nDays * parseFloat(dateRange.price);

    if (discounted) {
        totalPrice = applyDiscounts(totalPrice, dateRange.discounts)
    }

    return totalPrice
}

function instancePrice(instance, discounted) {
    let totalPrice = 0;

    for (const dateRange of instance.dateRanges) {
        totalPrice += dateRangePrice(dateRange, true)
    }

    if (discounted) {
        totalPrice = applyDiscounts(totalPrice, instance.discounts)
    }

    return totalPrice;
}

function productPrice(product, discounted) {
    let totalPrice = 0;

    for (const instance of Object.values(product.instances)) {
        totalPrice += instancePrice(instance, true)
    }

    if (discounted) {
        totalPrice = applyDiscounts(totalPrice, instance.discounts)
    }

    return totalPrice;
}

function rentalPrice(rental, discounted) {
    let totalPrice = 0;

    for (const product of rental.products) {
        totalPrice += productPrice(product, true)
    }

    if (discounted) {
        totalPrice = applyDiscounts(totalPrice, product.discounts)
    }

    return totalPrice;
}

export {
    dateRangePrice,
    instancePrice,
    productPrice,
    rentalPrice
}