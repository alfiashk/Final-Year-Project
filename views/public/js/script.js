(() => {
  'use strict'
  const forms = document.querySelectorAll('.needs-validation')
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

const togglePasswordButton = document.getElementById('togglePassword');
const passwordField = document.getElementById('password');


togglePasswordButton.addEventListener('click', function() {
  
    const type = passwordField.type === 'password' ? 'text' : 'password';
    passwordField.type = type;

    
    this.querySelector('i').classList.toggle('fa-eye-slash');  
    this.querySelector('i').classList.toggle('fa-eye');  
});

 