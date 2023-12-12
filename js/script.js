import { products } from "../data/products.js";
const basket = []; // {id, title, image, price, amount}
const pageSize = 4; // Sayfa başına kayıt sayısı
const totalRecords = products.length; // Tüm kayıt sayısı
const pageCount = Math.ceil(totalRecords / pageSize); // Toplam sayfa sayısı 1 tabanlı
let activePage = 0; // 0 tabanlı

const productList = document.getElementById("productList");
const paginator = document.getElementById("paginator");
const listBasket = document.getElementById("listBasket");

const loadProducts = () => {
	let strCols = "";
	const start = activePage * pageSize;
	const end = start + pageSize;

	products.slice(start, end).forEach((item) => {
		strCols += createProductItem(item);
	});

	productList.innerHTML = strCols;

	createPagination();
};

const createProductItem = (product) => {
	const { id, title, description, image, price } = product; // destructuring

	return `<div class="col">
    <div class="card h-100" data-id="${id}">
        <img src="img/${image}" alt="${title}" class="card-img-top">
        <div class="card-body">
            <h3 class="card-title">${title}</h3>
            <p class="card-text">${description}</p>
        </div>
        <div class="card-footer d-flex justify-content-between align-items-center">
            <h4>$${price}</h4>

            <div class="btn-group" role="group" aria-label="Basic example">
                <button type="button" class="btn btn-primary" data-op="remove"><i class="fa-solid fa-circle-minus"></i></button>

                <button type="button" class="btn btn-primary btn-display disabled">0</button>

                <button type="button" class="btn btn-primary" data-op="add"><i class="fa-solid fa-circle-plus"></i></button>
            </div>

        </div>
    </div>
</div>`;
};

const createPagination = () => {
	let strPaginator = `
        <li data-page="0" class="page-item ${
			activePage === 0 ? "disabled" : ""
		}">
            <a class="page-link" href="#">
                <i class="fa-solid fa-angles-left"></i>
            </a>
        </li>
        <li data-page="${activePage - 1}"  class="page-item ${
		activePage === 0 ? "disabled" : ""
	}">
            <a class="page-link" href="#"
                ><i class="fa-solid fa-angle-left"></i
            ></a>
        </li>`;

	for (let i = 0; i < pageCount; i++) {
		strPaginator += `
            <li data-page="${i}" class="page-item ${
			activePage === i ? "disabled" : ""
		}">
                <a class="page-link" href="#">${i + 1}</a>
            </li>`;
	}

	strPaginator += `
        <li data-page="${activePage + 1}" class="page-item ${
		activePage === pageCount - 1 ? "disabled" : ""
	}">
            <a class="page-link" href="#"
                ><i class="fa-solid fa-angle-right"></i
            ></a>
        </li>
        <li data-page="${pageCount - 1}" class="page-item ${
		activePage === pageCount - 1 ? "disabled" : ""
	}">
            <a class="page-link" href="#"
                ><i class="fa-solid fa-angles-right"></i
            ></a>
        </li>`;

	paginator.innerHTML = strPaginator;
};

const getProductItem = (id) => {
	return products.find((item) => item.id === id);
};

const getBasketItem = (id) => {
	return basket.find((item) => item.id === id);
};

const addBasket = (id) => {
	let basketItem = getBasketItem(id);

	if (basketItem) {
		basketItem.amount++;
	} else {
		const product = getProductItem(id);
		basketItem = {
			id: id,
			title: product.title,
			image: product.image,
			price: product.price,
			amount: 1,
		};
		basket.push(basketItem);
	}

	return basketItem.amount;
};

const removeBasket = (id) => {
	let basketItem = getBasketItem(id);
	if (!basketItem) return 0;

	if (basketItem.amount <= 1) {
		const index = basket.findIndex((item) => item.id === id);
		basket.splice(index, 1);
		return 0;
	} else {
		basketItem.amount--;
		return basketItem.amount;
	}
};

const loadBasket = () => {
	let strBasket = "";
	let totalPrice = 0;

	basket.forEach((item) => {
		const subTotalPrice = item.price * item.amount;
        totalPrice += subTotalPrice;


		strBasket += `
        <li class="nav-item d-flex justify-content-between gap-3 py-3 border-bottom">
            <img src="img/${item.image}" width="50"/>

            <div class="flex-grow-1">
                <h6>${item.title}</h6>
                <h5>$${item.price}  ${item.amount}pic  </h5>
            </div>

           <div>$${subTotalPrice.toFixed(2)}</div> 
        </li>`;
	});


    strBasket +=`<li class="mt-3 d-flex justify-content-between">
        <h4>Total</h4>
        <h4>$${totalPrice.toFixed(2)}</h4>
    </li>`


	listBasket.innerHTML = strBasket;
};

/* EVENT FUNCTIONS */

productList.addEventListener("click", (e) => {
	if (!e.target.classList.contains("btn")) return;
	const productId = Number(e.target.closest(".card").dataset.id);
	const operation = e.target.dataset.op;
	const btnDisplay = e.target
		.closest(".btn-group")
		.querySelector(".btn-display");
	let amount = 0;

	if (operation === "add") {
		amount = addBasket(productId);
	} else if (operation === "remove") {
		amount = removeBasket(productId);
	}

	btnDisplay.innerHTML = amount;

	loadBasket();
});

paginator.addEventListener("click", (e) => {
	const page = Number(e.target.dataset.page);
	console.log(page);

	activePage = page;
	loadProducts();
});

loadProducts();
