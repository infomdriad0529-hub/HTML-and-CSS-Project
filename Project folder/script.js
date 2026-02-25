// --- Navigation Logic ---
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.page-section');
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        sections.forEach(sec => sec.style.display = 'none');
        const target = this.getAttribute('href').substring(1);
        document.getElementById(target).style.display = '';
    });
});

// --- Dashboard Card Click Logic ---
document.getElementById('total-vehicles').style.cursor = 'pointer';
document.getElementById('total-drivers').style.cursor = 'pointer';
document.getElementById('total-trips').style.cursor = 'pointer';

document.getElementById('total-vehicles').addEventListener('click', function() {
    navLinks.forEach(l => l.classList.remove('active'));
    document.querySelector('.nav-link[href="#vehicles"]').classList.add('active');
    sections.forEach(sec => sec.style.display = 'none');
    document.getElementById('vehicles').style.display = '';
});
document.getElementById('total-drivers').addEventListener('click', function() {
    navLinks.forEach(l => l.classList.remove('active'));
    document.querySelector('.nav-link[href="#drivers"]').classList.add('active');
    sections.forEach(sec => sec.style.display = 'none');
    document.getElementById('drivers').style.display = '';
});
document.getElementById('total-trips').addEventListener('click', function() {
    navLinks.forEach(l => l.classList.remove('active'));
    document.querySelector('.nav-link[href="#trips"]').classList.add('active');
    sections.forEach(sec => sec.style.display = 'none');
    document.getElementById('trips').style.display = '';
});

// --- Utility Functions ---
function getData(key) {
    return JSON.parse(localStorage.getItem(key) || '[]');
}
function setData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}
function generateId(prefix, arr) {
    let max = 0;
    arr.forEach(item => {
        const id = parseInt(item.id.replace(prefix, ''));
        if (!isNaN(id) && id > max) max = id;
    });
    return prefix + (max + 1);
}

// --- Dashboard Update ---
function updateDashboard() {
    document.getElementById('total-vehicles').textContent = 'Vehicles: ' + getData('vehicles').length;
    document.getElementById('total-drivers').textContent = 'Drivers: ' + getData('drivers').length;
    document.getElementById('total-trips').textContent = 'Trips: ' + getData('trips').length;
}

// --- Vehicles CRUD ---
function renderVehicles() {
    const tbody = document.querySelector('#vehicles-table tbody');
    tbody.innerHTML = '';
    getData('vehicles').forEach(vehicle => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${vehicle.id}</td><td>${vehicle.type}</td><td>${vehicle.capacity}</td><td>${vehicle.status}</td>
            <td>
                <button class="action-btn" onclick="editVehicle('${vehicle.id}')">Edit</button>
                <button class="action-btn" onclick="deleteVehicle('${vehicle.id}')">Delete</button>
            </td>`;
        tbody.appendChild(tr);
    });
    updateVehicleSelect();
    updateDashboard();
}
function addOrUpdateVehicle(e) {
    e.preventDefault();
    const id = document.getElementById('vehicle-id').value;
    const type = document.getElementById('vehicle-type').value;
    const capacity = document.getElementById('vehicle-capacity').value;
    const status = document.getElementById('vehicle-status').value;
    if (!type || !capacity || !status) return;
    let vehicles = getData('vehicles');
    if (id) {
        vehicles = vehicles.map(v => v.id === id ? { id, type, capacity, status } : v);
    } else {
        const newId = generateId('V', vehicles);
        vehicles.push({ id: newId, type, capacity, status });
    }
    setData('vehicles', vehicles);
    document.getElementById('vehicle-form').reset();
    document.getElementById('vehicle-id').value = '';
    document.getElementById('vehicle-submit').textContent = 'Add Vehicle';
    renderVehicles();
}
function editVehicle(id) {
    const vehicle = getData('vehicles').find(v => v.id === id);
    if (!vehicle) return;
    document.getElementById('vehicle-id').value = vehicle.id;
    document.getElementById('vehicle-type').value = vehicle.type;
    document.getElementById('vehicle-capacity').value = vehicle.capacity;
    document.getElementById('vehicle-status').value = vehicle.status;
    document.getElementById('vehicle-submit').textContent = 'Update Vehicle';
}
function deleteVehicle(id) {
    let vehicles = getData('vehicles');
    vehicles = vehicles.filter(v => v.id !== id);
    setData('vehicles', vehicles);
    renderVehicles();
}
window.editVehicle = editVehicle;
window.deleteVehicle = deleteVehicle;
document.getElementById('vehicle-form').addEventListener('submit', addOrUpdateVehicle);

// --- Drivers CRUD ---
function renderDrivers() {
    const tbody = document.querySelector('#drivers-table tbody');
    tbody.innerHTML = '';
    getData('drivers').forEach(driver => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${driver.id}</td><td>${driver.name}</td><td>${driver.license}</td><td>${driver.contact}</td>
            <td>
                <button class="action-btn" onclick="editDriver('${driver.id}')">Edit</button>
                <button class="action-btn" onclick="deleteDriver('${driver.id}')">Delete</button>
            </td>`;
        tbody.appendChild(tr);
    });
    updateDriverSelect();
    updateDashboard();
}
function addOrUpdateDriver(e) {
    e.preventDefault();
    const id = document.getElementById('driver-id').value;
    const name = document.getElementById('driver-name').value.trim();
    const license = document.getElementById('driver-license').value.trim();
    const contact = document.getElementById('driver-contact').value.trim();
    if (!name || !license || !contact) return;
    let drivers = getData('drivers');
    if (id) {
        drivers = drivers.map(d => d.id === id ? { id, name, license, contact } : d);
    } else {
        const newId = generateId('D', drivers);
        drivers.push({ id: newId, name, license, contact });
    }
    setData('drivers', drivers);
    document.getElementById('driver-form').reset();
    document.getElementById('driver-id').value = '';
    document.getElementById('driver-submit').textContent = 'Add Driver';
    renderDrivers();
}
function editDriver(id) {
    const driver = getData('drivers').find(d => d.id === id);
    if (!driver) return;
    document.getElementById('driver-id').value = driver.id;
    document.getElementById('driver-name').value = driver.name;
    document.getElementById('driver-license').value = driver.license;
    document.getElementById('driver-contact').value = driver.contact;
    document.getElementById('driver-submit').textContent = 'Update Driver';
}
function deleteDriver(id) {
    let drivers = getData('drivers');
    drivers = drivers.filter(d => d.id !== id);
    setData('drivers', drivers);
    renderDrivers();
}
window.editDriver = editDriver;
window.deleteDriver = deleteDriver;
document.getElementById('driver-form').addEventListener('submit', addOrUpdateDriver);

// --- Trips CRUD ---
function updateVehicleSelect() {
    const select = document.getElementById('trip-vehicle');
    const vehicles = getData('vehicles');
    const current = select.value;
    select.innerHTML = '<option value="">Select Vehicle</option>';
    vehicles.forEach(v => {
        const opt = document.createElement('option');
        opt.value = v.id;
        opt.textContent = v.id + ' - ' + v.type;
        select.appendChild(opt);
    });
    select.value = current;
}
function updateDriverSelect() {
    const select = document.getElementById('trip-driver');
    const drivers = getData('drivers');
    const current = select.value;
    select.innerHTML = '<option value="">Select Driver</option>';
    drivers.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d.id;
        opt.textContent = d.id + ' - ' + d.name;
        select.appendChild(opt);
    });
    select.value = current;
}
function renderTrips() {
    const tbody = document.querySelector('#trips-table tbody');
    tbody.innerHTML = '';
    getData('trips').forEach(trip => {
        const vehicle = getData('vehicles').find(v => v.id === trip.vehicle) || {};
        const driver = getData('drivers').find(d => d.id === trip.driver) || {};
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${trip.id}</td><td>${vehicle.id || ''}</td><td>${driver.name || ''}</td><td>${trip.date}</td><td>${trip.destination}</td>
            <td>
                <button class="action-btn" onclick="editTrip('${trip.id}')">Edit</button>
                <button class="action-btn" onclick="deleteTrip('${trip.id}')">Delete</button>
            </td>`;
        tbody.appendChild(tr);
    });
    updateDashboard();
}
function addOrUpdateTrip(e) {
    e.preventDefault();
    const id = document.getElementById('trip-id').value;
    const vehicle = document.getElementById('trip-vehicle').value;
    const driver = document.getElementById('trip-driver').value;
    const date = document.getElementById('trip-date').value;
    const destination = document.getElementById('trip-destination').value.trim();
    if (!vehicle || !driver || !date || !destination) return;
    let trips = getData('trips');
    if (id) {
        trips = trips.map(t => t.id === id ? { id, vehicle, driver, date, destination } : t);
    } else {
        const newId = generateId('T', trips);
        trips.push({ id: newId, vehicle, driver, date, destination });
    }
    setData('trips', trips);
    document.getElementById('trip-form').reset();
    document.getElementById('trip-id').value = '';
    document.getElementById('trip-submit').textContent = 'Add Trip';
    renderTrips();
}
function editTrip(id) {
    const trip = getData('trips').find(t => t.id === id);
    if (!trip) return;
    document.getElementById('trip-id').value = trip.id;
    document.getElementById('trip-vehicle').value = trip.vehicle;
    document.getElementById('trip-driver').value = trip.driver;
    document.getElementById('trip-date').value = trip.date;
    document.getElementById('trip-destination').value = trip.destination;
    document.getElementById('trip-submit').textContent = 'Update Trip';
}
function deleteTrip(id) {
    let trips = getData('trips');
    trips = trips.filter(t => t.id !== id);
    setData('trips', trips);
    renderTrips();
}
window.editTrip = editTrip;
window.deleteTrip = deleteTrip;
document.getElementById('trip-form').addEventListener('submit', addOrUpdateTrip);

// --- Initial Render ---
function initialRender() {
    renderVehicles();
    renderDrivers();
    renderTrips();
    updateDashboard();
}
window.addEventListener('DOMContentLoaded', initialRender);

function showSection(sectionId) {
    document.querySelectorAll('.page-section').forEach(sec => sec.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
    document.body.classList.toggle('dashboard-active', sectionId === 'dashboard');
}