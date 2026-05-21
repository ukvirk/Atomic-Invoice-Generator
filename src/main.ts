import './style.css';

// ==========================================
// 1. DATA ARCHITECTURE & GLOBAL STATE
// ==========================================
interface LineItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

let lineItems: LineItem[] = [];

// ==========================================
// 2. CORE DOM SELECTION ENGINE
// ==========================================
// Sidebar Interactive Nodes
const itemsContainer = document.getElementById('dynamic-items-list') as HTMLDivElement;
const addItemButton = document.getElementById('add-item-btn') as HTMLButtonElement;
const invoiceIdInput = document.getElementById('invoice-id') as HTMLInputElement;
const currencySelect = document.getElementById('currency-select') as HTMLSelectElement;
const vendorNameInput = document.getElementById('vendor-name') as HTMLInputElement;
const clientNameInput = document.getElementById('client-name') as HTMLInputElement;

// Live Preview Sheet Target Node
const previewTarget = document.getElementById('invoice-preview-target') as HTMLDivElement;

// ==========================================
// 3. CURRENCY ENGINE (INTL SPECIFICATION)
// ==========================================
function formatCurrencyValue(amount: number, currencyCode: string): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2
    }).format(amount);
  } catch (error) {
    // Fallback if formatting breaks or rare currency codes fail
    return `${currencyCode} ${amount.toFixed(2)}`;
  }
}

// ==========================================
// 4. PREVIEW SHEET RENDERING ENGINE
// ==========================================
function updateInvoicePreviewDisplay() {
  const invoiceId = invoiceIdInput.value || 'INV-2026-XXX';
  const currency = currencySelect.value;
  const vendorName = vendorNameInput.value || 'Your Company Name';
  const clientName = clientNameInput.value || 'Client Company Name';

  // Perform Calculations
  let subtotal = 0;
  lineItems.forEach(item => {
    subtotal += item.quantity * item.price;
  });
  
  const taxRate = 0.15; // Strict 15% System Tax Specification
  const taxAmount = subtotal * taxRate;
  const totalAmount = subtotal + taxAmount;

  // Generate Items Rows for the Paper Sheet
  let invoiceRowsHTML = '';
  if (lineItems.length === 0) {
    invoiceRowsHTML = `<tr><td colspan="4" style="text-align: center; color: #94a3b8; padding: 20px;">No items added</td></tr>`;
  } else {
    lineItems.forEach(item => {
      const itemDesc = item.description || 'Untitled Item';
      const rowTotal = item.quantity * item.price;
      invoiceRowsHTML += `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">${itemDesc}</td>
          <td style="padding: 12px 0; text-align: center; border-bottom: 1px solid #e2e8f0;">${item.quantity}</td>
          <td style="padding: 12px 0; text-align: right; border-bottom: 1px solid #e2e8f0;">${formatCurrencyValue(item.price, currency)}</td>
          <td style="padding: 12px 0; text-align: right; border-bottom: 1px solid #e2e8f0; font-weight: 600;">${formatCurrencyValue(rowTotal, currency)}</td>
        </tr>
      `;
    });
  }

  // Inject Pure-Paper Production Layout into the White Sheet Container
  previewTarget.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; width: 100%;">
      <div>
        <h1 style="font-size: 28px; font-weight: 800; color: #0f172a; margin-bottom: 4px; letter-spacing: -1px;">INVOICE</h1>
        <p style="font-size: 14px; color: #475569; font-weight: 600;">ID: ${invoiceId}</p>
      </div>
      <div style="text-align: right;">
        <h3 style="font-size: 16px; font-weight: 700; color: #0f172a;">${vendorName}</h3>
      </div>
    </div>

    <div style="margin-bottom: 40px; border-top: 2px solid #0f172a; padding-top: 20px;">
      <h4 style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 6px;">Billed To:</h4>
      <p style="font-size: 16px; font-weight: 700; color: #1e293b;">${clientName}</p>
    </div>

    <table style="width: 100%; border-collapse: collapse; text-align: left; margin-bottom: 40px;">
      <thead>
        <tr style="border-bottom: 2px solid #cbd5e1; color: #475569; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">
          <th style="padding-bottom: 8px; font-weight: 700;">Description</th>
          <th style="padding-bottom: 8px; text-align: center; font-weight: 700; width: 80px;">Qty</th>
          <th style="padding-bottom: 8px; text-align: right; font-weight: 700; width: 120px;">Unit Price</th>
          <th style="padding-bottom: 8px; text-align: right; font-weight: 700; width: 120px;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${invoiceRowsHTML}
      </tbody>
    </table>

    <div style="margin-left: auto; width: 300px; border-top: 1px solid #cbd5e1; padding-top: 16px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; color: #475569;">
        <span>Subtotal:</span>
        <span>${formatCurrencyValue(subtotal, currency)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; color: #475569;">
        <span>Tax (15%):</span>
        <span>${formatCurrencyValue(taxAmount, currency)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: 800; color: #0f172a; border-top: 2px solid #0f172a; padding-top: 12px;">
        <span>Total Due:</span>
        <span>${formatCurrencyValue(totalAmount, currency)}</span>
      </div>
    </div>
  `;
}

// ==========================================
// 5. ATOMIC ELEMENT LIFECYCLE MANAGEMENT
// ==========================================
function syncRowInputsToState(rowWrapper: HTMLDivElement, id: string) {
  const descInput = rowWrapper.querySelector('.item-desc') as HTMLInputElement;
  const qtyInput = rowWrapper.querySelector('.item-qty') as HTMLInputElement;
  const priceInput = rowWrapper.querySelector('.item-price') as HTMLInputElement;

  const updateState = () => {
    const targetItem = lineItems.find(item => item.id === id);
    if (targetItem) {
      targetItem.description = descInput.value;
      targetItem.quantity = Math.max(1, parseInt(qtyInput.value) || 1);
      targetItem.price = Math.max(0, parseFloat(priceInput.value) || 0);
      updateInvoicePreviewDisplay();
    }
  };

  descInput.addEventListener('input', updateState);
  qtyInput.addEventListener('input', updateState);
  priceInput.addEventListener('input', updateState);
}

function createItemRowNode(id: string): HTMLDivElement {
  const rowWrapper = document.createElement('div');
  rowWrapper.className = 'item-row-atom';
  rowWrapper.setAttribute('data-id', id);

  rowWrapper.innerHTML = `
    <input type="text" class="item-desc" placeholder="Item description" autocomplete="off" />
    <input type="number" class="item-qty" placeholder="Qty" min="1" value="1" />
    <input type="number" class="item-price" placeholder="Price" min="0" step="0.01" />
    <button type="button" class="delete-row-btn" title="Remove Item">×</button>
  `;

  const deleteBtn = rowWrapper.querySelector('.delete-row-btn') as HTMLButtonElement;
  deleteBtn.addEventListener('click', () => {
    removeLineItemRow(id);
  });

  // Attach real-time structural listeners directly into the inputs
  syncRowInputsToState(rowWrapper, id);

  return rowWrapper;
}

function addNewLineItemRow() {
  const uniqueId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
  
  lineItems.push({
    id: uniqueId,
    description: '',
    quantity: 1,
    price: 0
  });

  const freshRowNode = createItemRowNode(uniqueId);
  itemsContainer.appendChild(freshRowNode);
  updateInvoicePreviewDisplay();
}

function removeLineItemRow(id: string) {
  lineItems = lineItems.filter(item => item.id !== id);
  const rowVisualElement = itemsContainer.querySelector(`[data-id="${id}"]`);
  if (rowVisualElement) {
    rowVisualElement.remove();
  }
  updateInvoicePreviewDisplay();
}

// ==========================================
// 6. GLOBAL EVENT BINDING INITIALIZATION
// ==========================================
invoiceIdInput.addEventListener('input', updateInvoicePreviewDisplay);
currencySelect.addEventListener('change', updateInvoicePreviewDisplay);
vendorNameInput.addEventListener('input', updateInvoicePreviewDisplay);
clientNameInput.addEventListener('input', updateInvoicePreviewDisplay);
addItemButton.addEventListener('click', addNewLineItemRow);

// Execute onboarding sequence
addNewLineItemRow();
updateInvoicePreviewDisplay();

console.log("Atomic Invoice System: Live Real-Time Mirror Engine Enabled.");