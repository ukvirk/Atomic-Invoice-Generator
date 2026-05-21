import './style.css';

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

let lineItems: LineItem[] = [];

const itemsContainer = document.getElementById('dynamic-items-list') as HTMLDivElement;
const addItemButton = document.getElementById('add-item-btn') as HTMLButtonElement;
const invoiceIdInput = document.getElementById('invoice-id') as HTMLInputElement;
const currencySelect = document.getElementById('currency-select') as HTMLSelectElement;
const vendorNameInput = document.getElementById('vendor-name') as HTMLInputElement;
const clientNameInput = document.getElementById('client-name') as HTMLInputElement;
const previewTarget = document.getElementById('invoice-preview-target') as HTMLDivElement;

function formatCurrency(amount: number, currencyCode: string): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2
    }).format(amount);
  } catch (e) {
    return `${currencyCode} ${amount.toFixed(2)}`;
  }
}

function renderPaperMatrix() {
  const invoiceId = invoiceIdInput.value || 'INV-2026-000';
  const currency = currencySelect.value;
  const vendor = vendorNameInput.value || 'Your Company Name';
  const client = clientNameInput.value || 'Client Company Name';

  let subtotal = 0;
  lineItems.forEach(item => subtotal += (item.quantity * item.price));
  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  let rowsHTML = '';
  if (lineItems.length === 0) {
    rowsHTML = `<tr><td colspan="4" style="text-align:center; padding:30px; color:#A6A8B8; font-weight:600; text-transform:uppercase; letter-spacing:1px;">No items configured</td></tr>`;
  } else {
    lineItems.forEach(item => {
      const desc = item.description || 'Untitled Item';
      const rowTotal = item.quantity * item.price;
      rowsHTML += `
        <tr style="border-bottom: 2px solid #F4F6FF;">
          <td style="padding: 16px 0; font-weight:600; color:#0D0F1C;">${desc}</td>
          <td style="padding: 16px 0; text-align: center; font-weight:700;">${item.quantity}</td>
          <td style="padding: 16px 0; text-align: right; font-weight:600; color:#4B4D5B;">${formatCurrency(item.price, currency)}</td>
          <td style="padding: 16px 0; text-align: right; font-weight:800; color:#FF1A69;">${formatCurrency(rowTotal, currency)}</td>
        </tr>
      `;
    });
  }

  previewTarget.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 60px;">
      <div>
        <h1 style="font-size: 42px; font-weight: 900; color: #0D0F1C; letter-spacing: -2px; line-height: 1;">INVOICE</h1>
        <p style="font-size: 14px; color: #FF1A69; font-weight: 800; margin-top: 8px; letter-spacing: 1px;">ID: ${invoiceId}</p>
      </div>
      <div style="text-align: right;">
        <h3 style="font-size: 20px; font-weight: 800; color: #0D0F1C;">${vendor}</h3>
      </div>
    </div>

    <div style="margin-bottom: 50px; border-top: 4px solid #0D0F1C; padding-top: 24px;">
      <h4 style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #A6A8B8; margin-bottom: 8px;">Billed To</h4>
      <p style="font-size: 22px; font-weight: 800; color: #0D0F1C;">${client}</p>
    </div>

    <table style="width: 100%; border-collapse: collapse; text-align: left; margin-bottom: 50px;">
      <thead>
        <tr style="border-bottom: 3px solid #0D0F1C; color: #0D0F1C; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
          <th style="padding-bottom: 12px; font-weight: 900;">Description</th>
          <th style="padding-bottom: 12px; text-align: center; font-weight: 900; width: 80px;">Qty</th>
          <th style="padding-bottom: 12px; text-align: right; font-weight: 900; width: 140px;">Unit Price</th>
          <th style="padding-bottom: 12px; text-align: right; font-weight: 900; width: 140px;">Amount</th>
        </tr>
      </thead>
      <tbody>${rowsHTML}</tbody>
    </table>

    <div style="margin-left: auto; width: 350px; background-color: #F8FAFC; padding: 24px; border-radius: 8px; border: 2px solid #E2E8F0;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; font-weight: 700; color: #4B4D5B;">
        <span>Subtotal</span>
        <span>${formatCurrency(subtotal, currency)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 14px; font-weight: 700; color: #4B4D5B;">
        <span>Tax (15%)</span>
        <span>${formatCurrency(tax, currency)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 24px; font-weight: 900; color: #0D0F1C; border-top: 3px solid #0D0F1C; padding-top: 16px;">
        <span>Total Due</span>
        <span style="color: #FF1A69;">${formatCurrency(total, currency)}</span>
      </div>
    </div>
  `;
}

function bindRowState(row: HTMLDivElement, id: string) {
  const desc = row.querySelector('.item-desc') as HTMLInputElement;
  const qty = row.querySelector('.item-qty') as HTMLInputElement;
  const price = row.querySelector('.item-price') as HTMLInputElement;

  const triggerUpdate = () => {
    const item = lineItems.find(i => i.id === id);
    if (item) {
      item.description = desc.value;
      item.quantity = Math.max(1, parseInt(qty.value) || 1);
      item.price = Math.max(0, parseFloat(price.value) || 0);
      renderPaperMatrix();
    }
  };

  desc.addEventListener('input', triggerUpdate);
  qty.addEventListener('input', triggerUpdate);
  price.addEventListener('input', triggerUpdate);
}

function createRowNode(id: string): HTMLDivElement {
  const row = document.createElement('div');
  row.className = 'item-row-atom';
  row.setAttribute('data-id', id);

  row.innerHTML = `
    <input type="text" class="item-desc" placeholder="Item details" autocomplete="off" />
    <input type="number" class="item-qty" placeholder="Qty" min="1" value="1" />
    <input type="number" class="item-price" placeholder="Price" min="0" step="0.01" />
    <button type="button" class="delete-row-btn" title="Drop Row">×</button>
  `;

  const btn = row.querySelector('.delete-row-btn') as HTMLButtonElement;
  btn.addEventListener('click', () => {
    lineItems = lineItems.filter(i => i.id !== id);
    row.remove();
    renderPaperMatrix();
  });

  bindRowState(row, id);
  return row;
}

function pushNewRow() {
  const id = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
  lineItems.push({ id, description: '', quantity: 1, price: 0 });
  itemsContainer.appendChild(createRowNode(id));
  renderPaperMatrix();
}

invoiceIdInput.addEventListener('input', renderPaperMatrix);
currencySelect.addEventListener('change', renderPaperMatrix);
vendorNameInput.addEventListener('input', renderPaperMatrix);
clientNameInput.addEventListener('input', renderPaperMatrix);
addItemButton.addEventListener('click', pushNewRow);

pushNewRow();
renderPaperMatrix();