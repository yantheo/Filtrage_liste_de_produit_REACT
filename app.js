//Variable qui liste l'ensemble de nos produits - On aurait aussi pu utiliser une API
const PRODUCTS = [
    { category: "Sport", price: "49,99€", name: "football", stocked: false },
    { category: "Sport", price: "29,99€", name: "rugby", stocked: true },
    { category: "Sport", price: "19,99€", name: "boxe", stocked: true },
    { category: "Sport", price: "9,99€", name: "tennis", stocked: true },
    { category: "Informatique", price: "399,99€", name: "iPhone 5", stocked: false },
    { category: "Informatique", price: "99,99€", name: "Dell PC", stocked: true },
    { category: "Informatique", price: "299,99€", name: "Playstation 4", stocked: false },
    { category: "Informatique", price: "49,99€", name: "Disque externe", stocked: true }
];

//function pour lister les entêtes prix et nom des produits 
//qu'on intégrera dans le forEach de la function ProductTable
function ProductRow({ product }) {
    //Fonction pour mettre la première lettre en majuscule
    const capitalize = (s) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }
    const name = product.stocked ? capitalize(product.name) : <span className="text-danger">{capitalize(product.name)}</span>
    return <tr>
        <td>
            {name}
        </td>
        <td>
            {product.price}
        </td>
    </tr>
}

//function pour insérer les categories des produits
//qu'on intégrera dans le forEach de la function ProductTable
function ProductCategoryRow({ category }) {
    return <tr>
        <th colSpan="2">{category}</th>
    </tr>
}

//function pour lister les produits et leur catégories dans le tableau
//On ajoute dans les paramètres les propriétés à filter instock et filtertext
function ProductTable({ products, inStock, filterText }) {
    const rows = []
    let lastCategory = null
    //Fonction pour mettre la première lettre en majuscule
    const capitalize = (s) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }
    products.forEach(product => {
        //si le stock est différend de produit en stock on return et le produit ne s'affiche pas
        //si le text ne renvoir rien, on return et le produit ne s'affiche pas
        if ((inStock && !product.stocked) || (product.name.indexOf(filterText) === -1)) {
            return
        }
        if (product.category !== lastCategory) {
            lastCategory = product.category
            rows.push(<ProductCategoryRow key={lastCategory} category={product.category} />)
        }
        rows.push(<ProductRow key={product.name} product={product} />)
    })
    return <table className="table text-center">
        <thead>
            <tr>
                <th>{capitalize("produits")}</th>
                <th>{capitalize("nom")}</th>
            </tr>
        </thead>
        <tbody>
            {rows}
        </tbody>
    </table>
}

//Class pour recherche un produit dans notre liste
class SearchBar extends React.Component {

    constructor(props) {
        super(props)
        this.handleFilterTextChange = this.handleFilterTextChange.bind(this)
        this.handleInStockChange = this.handleInStockChange.bind(this)
    }


    //function pour gérer le changement au niveau du filtre
    handleFilterTextChange(e) {
        this.props.onFilterTextChange(e.target.value)
    }

    //function pour gérer le changement au niveau du stock
    handleInStockChange(e) {
        this.props.onStockChange(e.target.checked)
    }


    render() {
        //On récupère le text et le stock du produit dans la propriété
        const { filterText, inStock } = this.props
        return <div className="mb-3">
            <div className="form-group mb-0">
                <input type="text" value={filterText} className="form-control" placeholder="Rechercher" onChange={this.handleFilterTextChange} />
            </div>
            <div>
                <div className="form-check">
                    <input type="checkbox" checked={inStock} className="form-check-input" id="stock" onChange={this.handleInStockChange} />
                    <label htmlFor="stock" className="form-check-label">Produits en stock</label>
                </div>
            </div>
        </div>
    }
}

//On créé une class pour lister l'ensemble des produits
class FilterableProductTable extends React.Component {
    //On ajoute à l'état les propriétés filterText et inStock
    constructor(props) {
        super(props)
        this.state = {
            filterText: "",
            inStock: false
        }
        this.handleFilterTextChange = this.handleFilterTextChange.bind(this)
        this.handleInStockChange = this.handleInStockChange.bind(this)
    }

    //fonction qui prendra en parametre le nouveau text
    handleFilterTextChange(filterText) {
        this.setState({ filterText })
    }

    //fonction qui prendra en parametre le stock
    handleInStockChange(inStock) {
        this.setState({ inStock })
    }

    render() {
        const { products } = this.props;
        //On insère notre composant SearchBar dans notre composant FilterableProduct avec <React.Fragment>
        return <React.Fragment>
            {/*JSON.stringify(this.state)*/}
            <SearchBar
                filterText={this.state.filterText}
                inStock={this.state.inStock}
                //On ajoute les fonctions aux propriétés de la searchbar pour remonter l'information
                onFilterTextChange={this.handleFilterTextChange}
                onStockChange={this.handleInStockChange} />
            <ProductTable
                products={products}
                //On récupère les nouvelles propriétés via la searchbar et on les passe à la table des produits
                filterText={this.state.filterText}
                inStock={this.state.inStock} />
        </React.Fragment>
    }
}

ReactDOM.render(<FilterableProductTable products={PRODUCTS} />, document.getElementById('app'))