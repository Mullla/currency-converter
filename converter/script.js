// получаю область с переключателями
const toggleCurrency = document.querySelector('.choice'),
    // получаю блоки с валютой
    blockUSD = document.querySelector('.usd-block'),
    blockEUR = document.querySelector('.eur-block');

// переключаю видимость элементов
toggleCurrency.addEventListener('click', (e) => {
    let target = e.target;

    if (target.classList.contains('usd')) {
        blockUSD.classList.add('show');
        blockEUR.classList.remove('show');
    } else if(target.classList.contains('eur')){
        blockEUR.classList.add('show');
        blockUSD.classList.remove('show');
    }

});


const url = 'https://api.exchangeratesapi.io/latest?base=RUB&symbols=USD,EUR';

// составляю запрос с помощью fetch
const getCurrency = () => {
    return fetch(url);
};

// отправляю и обрабатываю запрос
getCurrency()
    //изначально возвращает respinseStream, надо превратить в объект json
    .then( (response) => {
        if (response.status !== 200) {
            throw new Error('network status not 200: ' + response.status);
        }
        return response.json();
    })
    .then( (response) => {
        // * здесь обработка ответа
        // в функцию конвертации передаю текущий курс
        convertData(response.rates.EUR, response.rates.USD);
    })
    .catch( (err) => console.log(err));

// функция, выводит конвертируемые значения в инпут
// вход: инпут со значением, инпут, где выводится сконвертированное значение, курс валют
const convertOutput = (input, output, currency) => {
    output.value = input.value / currency;
}

// функция конвертации
// получаю все инпуты, навещиваю им обработчики на ввод
const convertData = (currentEUR, currentUSD) => {
    const inputs = document.querySelectorAll('.input');

    inputs.forEach( item => {
        item.addEventListener('input', (e) => {
            let target = e.target;

            //запрещаю ввод символов кроме цифр
            target.value = target.value.replace(/[^\d]/g, '');

            // получаю инпут вывода данных, который относится к инпуту, 
            // в который вводится значение
            const output = target.closest('div').querySelector('.output'),
            // получаю кнопку "конвертировать"
                convertBtn = target.closest('div').querySelector('.convert-btn');

                // при клике на кнопку запускается функция конвертации
                convertBtn.addEventListener('click', () => {
                    // из долларов в рубли
                    if(target.dataset.currency === 'usd-rub'){
                        convertOutput(item, output, currentUSD);
                    // из рублей в доллары
                    } else if(target.dataset.currency === 'rub-usd'){
                        convertOutput(item, output, (1 / currentUSD));
                    // из евро в рубли
                    } else if(target.dataset.currency === 'eur-rub'){
                        convertOutput(item, output, currentEUR);
                    // из рублей в евро
                    } else if(target.dataset.currency === 'rub-eur'){
                        convertOutput(item, output, (1 / currentEUR));
                    } 

                });
        });
    });
}

