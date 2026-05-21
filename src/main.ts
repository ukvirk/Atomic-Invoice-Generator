import './style.css';

// 1. DATA STATE
interface LineItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

let lineItems: LineItem[] = [];

// 2. DOM NODES
const itemsContainer = document.getElementById('dynamic-items-list') as HTMLDivElement;
const addItemButton = document.getElementById('add-item-btn') as HTMLButtonElement;
const invoiceIdInput = document.getElementById('invoice-id') as HTMLInputElement;
const currencySelect = document.getElementById('currency-select') as HTMLSelectElement;
const vendorNameInput = document.getElementById('vendor-name') as HTMLInputElement;
const clientNameInput = document.getElementById('client-name') as HTMLInputElement;
const previewTarget = document.getElementById('invoice-preview-target') as HTMLDivElement;

// 3. CURRENCY FORMATTER
function formatCurrency(amount: number, currencyCode: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
}

// 4. RENDER ENGINE (NEO-BRUTALIST LAYOUT)
function renderInvoice() {
  const invoiceId = invoiceIdInput.value || 'INV-000';
  const currency = currencySelect.value;
  const vendorName = vendorNameInput.value || 'YOUR AGENCY';
  const clientName = clientNameInput.value || 'CLIENT CORP';

  let subtotal = 0;
  lineItems.forEach(item => subtotal += item.quantity * item.price);
  const taxRate = 0.15;
  const taxAmount = subtotal * taxRate;
  const totalAmount = subtotal + taxAmount;

  let rowsHTML = '';
  if (lineItems.length === 0) {
    rowsHTML = `<tr><td colspan="4" style="padding: 40px 0; color: #A6A8B8; text-align: center;">Awaiting Data Injection...</td></tr>`;
  } else {
    lineItems.forEach(item => {
      const rowTotal = item.quantity * item.price;
      rowsHTML += `
        <tr>
          <td style="padding: 24px 0; border-bottom: 2px solid #000; font-family: 'Space Grotesk'; font-weight: 600; font-size: 16px;">${item.description || 'Data Unit'}</td>
          <td style="padding: 24px 0; border-bottom: 2px solid #000; text-align: center; font-family: 'Space Grotesk';">${item.quantity}</td>
          <td style="padding: 24px 0; border-bottom: 2px solid #000; text-align: right; font-family: 'Space Grotesk';">${formatCurrency(item.price, currency)}</td>
          <td style="padding: 24px 0; border-bottom: 2px solid #000; text-align: right; font-family: 'Space Grotesk'; font-weight: 700; color: #FF1A69;">${formatCurrency(rowTotal, currency)}</td>
        </tr>
      `;
    });
  }

  previewTarget.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 60px;">
      <div>
        <h1 style="font-family: 'Montserrat'; font-size: 64px; font-weight: 900; letter-spacing: -3px; line-height: 1;">INVOICE</h1>
        <p style="font-family: 'Space Grotesk'; font-size: 16px; color: #A6A8B8; margin-top: 8px;">ID // ${invoiceId}</p>
      </div>
      <div style="text-align: right;">
        <h2 style="font-family: 'Montserrat'; font-size: 24px; font-weight: 900; letter-spacing: -1px;">${vendorName}</h2>
      </div>
    </div>

    <div style="background-color: #000; color: #fff; padding: 30px; margin-bottom: 60px;">
      <p style="font-family: 'Space Grotesk'; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #A6ECF2; margin-bottom: 8px;">Billed Entity</p>
      <h3 style="font-family: 'Montserrat'; font-size: 32px; font-weight: 700; letter-spacing: -1px;">${clientName}</h3>
    </div>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 80px;">
      <thead>
        <tr>
          <th style="text-align: left; padding-bottom: 16px; border-bottom: 4px solid #000; font-family: 'Montserrat'; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Description</th>
          <th style="text-align: center; padding-bottom: 16px; border-bottom: 4px solid #000; font-family: 'Montserrat'; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Qty</th>
          <th style="text-align: right; padding-bottom: 16px; border-bottom: 4px solid #000; font-family: 'Montserrat'; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Price</th>
          <th style="text-align: right; padding-bottom: 16px; border-bottom: 4px solid #000; font-family: 'Montserrat'; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHTML}
      </tbody>
    </table>

    <div style="margin-left: auto; width: 400px;">
      <div style="display: flex; justify-content: space-between; padding: 16px 0; border-bottom: 1px solid #E2E8F0; font-family: 'Space Grotesk';">
        <span style="color: #6A797E;">Subtotal</span>
        <span style="font-weight: 600;">${formatCurrency(subtotal, currency)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 16px 0; border-bottom: 1px solid #E2E8F0; font-family: 'Space Grotesk';">
        <span style="color: #6A797E;">Tax (15%)</span>
        <span style="font-weight: 600;">${formatCurrency(taxAmount, currency)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 24px 0; margin-top: 16px; border-top: 4px solid #000; font-family: 'Montserrat'; font-size: 32px; font-weight: 900; letter-spacing: -1px;">
        <span>TOTAL</span>
        <span style="color: #FF1A69;">${formatCurrency(totalAmount, currency)}</span>
      </div>
    </div>
  `;
}

// 5. ATOMIC ROW BUILDER
function createRowNode(id: string): HTMLDivElement {
  const row = document.createElement('div');
  row.className = 'item-row-atom';
  row.setAttribute('data-id', id);

  row.innerHTML = `
    <input type="text" class="item-desc" placeholder="Data Unit" autocomplete="off" />
    <input type="number" class="item-qty" placeholder="0" min="1" value="1" />
    <input type="number" class="item-price" placeholder="0.00" min="0" step="0.01" />
    <button type="button" class="delete-row-btn">×</button>
  `;

  row.querySelector('.delete-row-btn')!.addEventListener('click', () => removeRow(id));

  const inputs = row.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      const target = lineItems.find(i => i.id === id);
      if (target) {
        target.description = (row.querySelector('.item-desc') as HTMLInputElement).value;
        target.quantity = Math.max(1, parseInt((row.querySelector('.item-qty') as HTMLInputElement).value) || 1);
        target.price = Math.max(0, parseFloat((row.querySelector('.item-price') as HTMLInputElement).value) || 0);
        renderInvoice();
      }
    });
    
    // Cursor hover logic for inputs
    input.addEventListener('mouseenter', () => expandCursor());
    input.addEventListener('mouseleave', () => shrinkCursor());
  });

  return row;
}

function addRow() {
  const uniqueId = Date.now().toString();
  lineItems.push({ id: uniqueId, description: '', quantity: 1, price: 0 });
  itemsContainer.appendChild(createRowNode(uniqueId));
  renderInvoice();
}

function removeRow(id: string) {
  lineItems = lineItems.filter(item => item.id !== id);
  const row = itemsContainer.querySelector(`[data-id="${id}"]`);
  if (row) row.remove();
  renderInvoice();
}

// 6. KINETIC CURSOR ENGINE & MAGNETIC PHYSICS
const cursorDot = document.getElementById('cursor-dot') as HTMLDivElement;
const cursorOutline = document.getElementById('cursor-outline') as HTMLDivElement;

window.addEventListener('mousemove', (e) => {
  const posX = e.clientX;
  const posY = e.clientY;
  
  cursorDot.style.left = `${posX}px`;
  cursorDot.style.top = `${posY}px`;
  
  cursorOutline.animate({
    left: `${posX}px`,
    top: `${posY}px`
  }, { duration: 500, fill: "forwards" });
});

function expandCursor() {
  cursorOutline.style.width = '60px';
  cursorOutline.style.height = '60px';
  cursorOutline.style.backgroundColor = 'rgba(255, 26, 105, 0.1)';
}

function shrinkCursor() {
  cursorOutline.style.width = '40px';
  cursorOutline.style.height = '40px';
  cursorOutline.style.backgroundColor = 'transparent';
}

// Magnetic Button Logic
const magneticBtn = document.querySelector('.btn-magnetic') as HTMLButtonElement;
magneticBtn.addEventListener('mousemove', (e) => {
  const rect = magneticBtn.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  magneticBtn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
});
magneticBtn.addEventListener('mouseleave', () => {
  magneticBtn.style.transform = `translate(0px, 0px)`;
});
magneticBtn.addEventListener('mouseenter', expandCursor);
magneticBtn.addEventListener('mouseleave', shrinkCursor);

// 7. INITIALIZATION
invoiceIdInput.addEventListener('input', renderInvoice);
currencySelect.addEventListener('change', renderInvoice);
vendorNameInput.addEventListener('input', renderInvoice);
clientNameInput.addEventListener('input', renderInvoice);
addItemButton.addEventListener('click', addRow);

addRow();
renderInvoice();