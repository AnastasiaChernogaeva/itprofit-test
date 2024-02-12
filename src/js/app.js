import '../sass/app.sass';

const openPopUp = document.getElementById('open_pop_up');
const closePopUp = document.getElementById('pop_up_close');
const popUp = document.getElementById('pop_up');

const form = document.getElementById('form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const message = document.getElementById('message');

openPopUp.addEventListener('click', (e) => {
    e.preventDefault();
    popUp.classList.add('active');
});

closePopUp.addEventListener('click', (e) => {
    popUp.classList.remove('active');    
    clearFields();
});

const clearFields = () => {
    let arrFields = [username, email, phone, message];
    arrFields.forEach(element => {
        element.value = '';        
        element.parentElement.querySelector('.error').innerText = '';
        element.parentElement.classList.remove('error');    
        element.parentElement.classList.remove('success');
    });
};



const requestURL = 'https://localhost:9090';

const sendRequest = async (method, reqUrl, reqBody) => {
    const headers = {
        'Content-Type': 'application/json'
      }
    
      return fetch(url, {
        method: method,
        body: JSON.stringify(body),
        headers: headers
      }).then(response => {
        if (response.status === 'success') {
          return true;
        }
        return false;
      })
    };

form.addEventListener('submit', e => {
    e.preventDefault();
    const valid = validateInputs();
    if (valid) {
        let response = sendRequest('POST', requestURL, valid);
        if (response) {
            popUp.classList.remove('active');
            clearFields();
        }
    }
});

const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success')
};

const setSuccess = (element) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
};

const isValidEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

const mask = new IMask(phone, {
    mask: "+{375}(00)000-00-00"
});

const validateInputs = () => {
    const usernameValue = username.value.trim();
    const emailValue = email.value.trim();
    const phoneValue = phone.value.trim();
    const messageValue = message.value.trim();
    const validatedResponses = [];
    const reqBody = {};

    if(usernameValue === '') {
        setError(username, 'Имя пользователя обязательно');
        validatedResponses.push(false);
    } else {
        setSuccess(username);
        reqBody['username'] = usernameValue;
        validatedResponses.push(true);
    }

    if(emailValue === '') {
        setError(email, 'Почта обязательна');
        validatedResponses.push(false);
    } else if (!isValidEmail(emailValue)) {
        setError(email, 'Предоставьте корректную почту');
        validatedResponses.push(false);
    } else {
        setSuccess(email);
        reqBody['email'] = emailValue;
        validatedResponses.push(true);
    }

    if(phoneValue === '') {
        setError(phone, 'Номер телефона обязателен');
        validatedResponses.push(false);
    } else if (!mask.masked.isComplete) {
        setError(phone, 'Предоставьте корректный номер телефона');
        validatedResponses.push(false);
    } else {
        setSuccess(phone);
        reqBody['phone'] = phoneValue;
        validatedResponses.push(true);
    }

    if(messageValue === '') {
        setError(message, 'Пожалуйста, введите сообщение');
        validatedResponses.push(false);
    } else {
        setSuccess(message);
        reqBody['message'] = messageValue;
        validatedResponses.push(true);
    }

    if (validatedResponses.some(e => !e)) return false;
    return reqBody;
};
