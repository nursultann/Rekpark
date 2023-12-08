function Conditional({ condition, orElse = null, children }) {
    return condition ? children : orElse
}

export default Conditional