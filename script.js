document.addEventListener('DOMContentLoaded', function() {
    // Current date
    let currentDate = new Date();
    let selectedDate = null;
    let selectedService = null;
    let selectedTime = null;
    let selectedProfessional = null;
    
    // Initialize calendar
    renderCalendar(currentDate);
    
    // Service selection
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            serviceCards.forEach(c => {
                c.querySelector('div').classList.remove('border-blue-400', 'bg-blue-50');
            });
            this.querySelector('div').classList.add('border-blue-400', 'bg-blue-50');
            selectedService = this.querySelector('h3').textContent;
            document.getElementById('selected-service-text').textContent = selectedService;
        });
    });
    
    // Calendar navigation
    document.getElementById('prev-month').addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });
    
    document.getElementById('next-month').addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });
    
    // Date selection
    document.getElementById('calendar-days').addEventListener('click', function(e) {
        if (e.target.classList.contains('calendar-day') && !e.target.classList.contains('disabled')) {
            const days = document.querySelectorAll('.calendar-day');
            days.forEach(day => day.classList.remove('selected'));
            e.target.classList.add('selected');
            
            const day = parseInt(e.target.textContent);
            selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            
            // Format date for display
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = selectedDate.toLocaleDateString('pt-BR', options);
            document.getElementById('selected-date-text').textContent = formattedDate;
            
            // Show time selection
            document.getElementById('step-1').classList.add('hidden');
            document.getElementById('step-2').classList.remove('hidden');
            document.getElementById('step-2').classList.add('fade-in');
        }
    });
    
    // Back to calendar
    document.getElementById('back-to-calendar').addEventListener('click', function() {
        document.getElementById('step-2').classList.add('hidden');
        document.getElementById('step-1').classList.remove('hidden');
        document.getElementById('step-1').classList.add('fade-in');
    });
    
    // Time slot selection
    const timeSlots = document.querySelectorAll('.time-slot:not(.booked)');
    timeSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            timeSlots.forEach(s => s.classList.remove('selected'));
            this.classList.add('selected');
            selectedTime = this.textContent;
        });
    });
    
    // Confirm appointment
    document.getElementById('confirm-appointment').addEventListener('click', function() {
        if (!selectedTime) {
            alert('Por favor, selecione um horário');
            return;
        }
        
        // Set confirmation details
        document.getElementById('confirmation-date').textContent = 
            selectedDate.toLocaleDateString('pt-BR') + ' às ' + selectedTime;
        document.getElementById('confirmation-service').textContent = selectedService || 'Corte de Cabelo';
        document.getElementById('confirmation-professional').textContent = 'João Silva';
        
        // Show confirmation
        document.getElementById('step-2').classList.add('hidden');
        document.getElementById('step-3').classList.remove('hidden');
        document.getElementById('step-3').classList.add('fade-in');
    });
    
    // New appointment
    document.getElementById('new-appointment').addEventListener('click', function() {
        // Reset selections
        selectedDate = null;
        selectedTime = null;
        
        // Reset UI
        document.querySelectorAll('.calendar-day').forEach(day => day.classList.remove('selected'));
        document.querySelectorAll('.time-slot').forEach(slot => slot.classList.remove('selected'));
        document.querySelectorAll('.service-card').forEach(card => {
            card.querySelector('div').classList.remove('border-blue-400', 'bg-blue-50');
        });
        
        // Show calendar
        document.getElementById('step-3').classList.add('hidden');
        document.getElementById('step-1').classList.remove('hidden');
        document.getElementById('step-1').classList.add('fade-in');
    });
    
    // Render calendar function
    function renderCalendar(date) {
        const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        
        // Update month/year display
        document.getElementById('current-month').textContent = 
            `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
        
        // Get first day of month and total days in month
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        
        // Get days from previous month to show
        const prevMonthDays = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
        
        // Generate calendar days
        let calendarHTML = '';
        
        // Previous month's days
        for (let i = firstDay; i > 0; i--) {
            calendarHTML += `<div class="calendar-day disabled p-2 text-center text-gray-400">${prevMonthDays - i + 1}</div>`;
        }
        
        // Current month's days
        const today = new Date();
        for (let i = 1; i <= daysInMonth; i++) {
            const isToday = today.getDate() === i && 
                            today.getMonth() === date.getMonth() && 
                            today.getFullYear() === date.getFullYear();
            
            const dayClass = isToday ? 'border-2 border-blue-500 font-bold' : '';
            const disabledClass = (date.getMonth() < today.getMonth() && date.getFullYear() <= today.getFullYear()) || 
                                    (date.getMonth() === today.getMonth() && i < today.getDate() && date.getFullYear() === today.getFullYear()) ?
                                    'disabled text-gray-400' : '';
            
            calendarHTML += `
                <div class="calendar-day ${dayClass} ${disabledClass} p-2 text-center rounded-lg">
                    ${i}
                </div>
            `;
        }
        
        // Next month's days (to complete the grid)
        const daysToAdd = 42 - (firstDay + daysInMonth); // 6 rows x 7 days = 42 cells
        for (let i = 1; i <= daysToAdd; i++) {
            calendarHTML += `<div class="calendar-day disabled p-2 text-center text-gray-400">${i}</div>`;
        }
        
        document.getElementById('calendar-days').innerHTML = calendarHTML;
    }
});