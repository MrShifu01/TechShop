export const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2)
}

export const updateCart = (state) => {
    // Calculate items price
    state.itemsPrice = addDecimals(state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0))
    // Calculate shipping price (if order is over R100, then Free, else R10)
    state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10)
    // Calculate tax price 15%
    state.taxPrice = addDecimals(Number(state.itemsPrice * 0.15).toFixed(2))
    // Calculate total price
    state.totalPrice = (
        Number(state.itemsPrice) +
        Number(state.shippingPrice) +
        Number(state.taxPrice)
    ).toFixed(2)

    localStorage.setItem('cart', JSON.stringify(state))

    return state
}