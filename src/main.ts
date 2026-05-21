import './style.css';

// 1. STATE MANAGEMENT CONTROL: THE GOLD STANDARD TRACKING ARRAY
interface LineItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

let lineItems: LineItem[] = [];

// 2. CORE INTERACTIVE TARGET NODES
const itemsContainer = document.getElementById('dynamic-items-list') as HTMLDivElement;
const addItemButton = document.getElementById('add-item-btn') as HTMLButtonElement;

// 3. THE ATOMIC ROW DOM FACTORY (WHY: Creates isolated, clean nodes with explicit 44px tap targets)
function createItemRowNode(id: string): HTMLDivElement {
  const rowWrapper = document.createElement('div');
  rowWrapper.className = 'item-row-atom';
  rowWrapper.setAttribute('data-id', id);

  rowWrapper.innerHTML = `
    <input type="text" class="item-desc" placeholder="Item description" autocomplete="off" style="height: 44px;" />
    <input type="number" class="item-qty" placeholder="Qty" min="1" value="1" style="height: 44px;" />
    <input type="number" class="item-price" placeholder="Price" min="0" step="0.01" style="height: 44px;" />
    <button type="button" class="delete-row-btn" title="Remove Item">×</button>
  `;

  // HOOK UP INNER ACTION ANCHOR: THE REMOVAL OPERATOR
  const deleteBtn = rowWrapper.querySelector('.delete-row-btn') as HTMLButtonElement;
  deleteBtn.addEventListener('click', () => {
    removeLineItemRow(id);
  });

  return rowWrapper;
}

// 4. ACTION CONTROLLER: APPEND NEW RAW TO STACK
function addNewLineItemRow() {
  const uniqueId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
  
  // Update state tracking
  lineItems.push({
    id: uniqueId,
    description: '',
    quantity: 1,
    price: 0
  });

  // Inject structural element to screen workspace
  const freshRowNode = createItemRowNode(uniqueId);
  itemsContainer.appendChild(freshRowNode);
}

// 5. DESTRUCTIVE ACTION CONTROLLER: DROP RAW FROM STACK
function removeLineItemRow(id: string) {
  // Purge state data tracking
  lineItems = lineItems.filter(item => item.id !== id);
  
  // Purge visual physical element from workspace UI
  const rowVisualElement = itemsContainer.querySelector(`[data-id="${id}"]`);
  if (rowVisualElement) {
    rowVisualElement.remove();
  }
}

// 6. INITIALIZATION DECK: EVENT BINDINGS
addItemButton.addEventListener('click', addNewLineItemRow);

// Always spawn one initial item block automatically for pristine user experience onboarding
addNewLineItemRow();

console.log("Atomic Invoice State Engine Fully Initialized.");