// Configuration - Dane z Twojego projektu Supabase
const SUPABASE_URL = "https://ktjwaewacbqhythbskzd.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0andhZXdhY2JxaHl0aGJza3pkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0OTI2NjQsImV4cCI6MjA5MzA2ODY2NH0.9UEt_fnOTvaO82CnckpM88Bs1gHAWhNODfDARUPcymc";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const form = document.getElementById('regForm');
const messageDiv = document.getElementById('message');
const submitBtn = document.getElementById('submitBtn');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const displayName = document.getElementById('displayName').value.trim();

    // UI State: Loading
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    messageDiv.className = 'message';
    messageDiv.style.display = 'none';

    try {
        // 1. Sprawdź czy użytkownik już istnieje
        const { data: existingUser, error: checkError } = await supabase
            .from('users')
            .select('username')
            .eq('username', username)
            .maybeSingle();

        if (checkError) throw checkError;

        if (existingUser) {
            showMessage('Ten nick jest już zarejestrowany!', 'error');
            return;
        }

        // 2. Wstaw nowego użytkownika
        const { error: insertError } = await supabase
            .from('users')
            .insert([
                { 
                    username: username, 
                    display_name: displayName,
                    hwid: null,
                    banned: false
                }
            ]);

        if (insertError) throw insertError;

        showMessage('Zarejestrowano pomyślnie! Możesz teraz odpalić Minecrafta.', 'success');
        form.reset();

    } catch (error) {
        console.error('Błąd:', error);
        showMessage('Wystąpił błąd: ' + (error.message || 'Błąd połączenia'), 'error');
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
});

function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
}
