import './css/style.scss';

const wallet = 200;
let sumBasket = 0;
let countBasket = 0;

const myProducts = document.querySelectorAll('.product');
const dndArea = document.querySelector('.dnd-area_receiver');
const myBasket = document.querySelector('.basket');

document.querySelector('.title__sub-info').innerHTML = `Бюджет: ${wallet}$`;

myProducts.forEach((curValue) => {
  curValue.addEventListener('dragstart', (ev) => {
    ev.dataTransfer.setData('text/plain', ev.target.id);
  });
});

dndArea.addEventListener('dragover', ev => ev.preventDefault());

dndArea.addEventListener('dragenter', (ev) => {
  ev.currentTarget.children[1].style.background = 'rgb(245,245,196)';
});
dndArea.addEventListener('dragleave', (ev) => {
  ev.target.style.background = '';
});

dndArea.addEventListener('drop', (ev) => {
  ev.preventDefault();
  const itemId = ev.dataTransfer.getData('text/plain');
  const tmp = document.querySelector(`#${itemId}`);
  const newItem = tmp.cloneNode(true);
  newItem.id = `${newItem.id}_inBuket`;
  newItem.dataset.count = 1;
  ev.target.style.background = '';

  const event = new CustomEvent('orderItem', {
    'detail': {
      'product': newItem,
      'id': newItem.id,
    },
  });
  dndArea.dispatchEvent(event);
});

dndArea.addEventListener('orderItem', (ev) => {
  const tmp = document.querySelector(`#${ev.detail.id}`);
  const shopItem = document.querySelector(`#${ev.detail.id.slice(0, -8)}`);
  const price = parseFloat(shopItem.dataset.price, 10);

  if ((sumBasket + price) < wallet) {
    if (shopItem.dataset.count > 0) {
      shopItem.children[3].textContent = `Count: ${--shopItem.dataset.count}`;
      sumBasket += price;
      dndArea.children[0].children[1].innerHTML = `Сумма: ${sumBasket.toFixed(2)}$ <br> Колличество товаров: ${++countBasket}`;
      document.querySelector('.helper').style.display = 'none';
      if (tmp) {
        tmp.children[3].textContent = `Count: ${++tmp.dataset.count}`;
      } else {
        ev.detail.product.children[3].textContent = 'Count: 1';
        myBasket.appendChild(ev.detail.product);
      }
    } else {
      alert('Товар закончился');
    }
  } else {
    alert('Вы исчерпали свой бюджет');
  }
});
