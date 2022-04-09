let searchForm = document.querySelector('.search-form');

document.querySelector('#search-btn').onclick = () =>{
    searchForm.classList.toggle('active');
}
window.onscroll = () =>{
    searchForm.classList.remove('active');
}

// chạy ảnh background 
var slideIndex = 0;
showSlides();

function plusSlides(n) {
    showSlides2(slideIndex += n);
}

function showSlides2(n) {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    if(n > slides.length)
        {slideIndex = 1}
    if(n < 1)
        {slideIndex = slides.length}
    for(i=0; i < slides.length; i++)
    {
        slides[i].style.display = "none";
    }
    slides[slideIndex-1].style.display = "block";
}

function showSlides() {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    for(i=0; i < slides.length; i++)
    {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if(slideIndex > slides.length)
        {slideIndex = 1}
    slides[slideIndex-1].style.display = "block";
    setTimeout(showSlides, 5000);
}
//Son them
function Validator(formSelector, options){
    // gan gia tri mac dinh cho tham so (ES5)
    if(!options){
        options = {};
    }
    function getParent(element, selector){
        while(element.parentElement.matches(selector)){
            return element.parentElement;
        }
        element = element.parentElement;
    }
    var formRules = {};
    /**
     * Quy uoc tao rule:
     * - Neu co loi thi return 'error message'
     * - Neu khong co loi thi return 'undefined'
     */
    var validatorRules = {
        required: function (value){
            return value ? undefined : 'Vui lòng nhập trường này';
        },
        email: function (value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Vui lòng nhập email';
        },
        min: function (min){
            return function (value){
                return value.length >= min ? undefined : `Vui lòng nhập ít nhất ${min} kí tự`;
            }
        },
    };


    var ruleName = 'required';
    console.log(validatorRules[ruleName]);
    //lay ra form 
    var formElement = document.querySelector(formSelector);
    if(formElement){
        var inputs = formElement.querySelectorAll('[name][rules]');
        for (var input of inputs){
            var rules = input.getAttribute('rules').split('|');
            for (var rule of rules){
                var ruleInfo;
                var isRuleHasValue = rule.includes(':');
                
                if(isRuleHasValue){
                    ruleInfo = rule.split(':');
                    rule = ruleInfo[0];
                }
                var ruleFunc = validatorRules[rule];
                
                if(isRuleHasValue){
                    ruleFunc = ruleFunc(ruleInfo[1]);
                }
               
                if(Array.isArray(formRules[input.name])){
                    formRules[input.name].push(ruleFunc);
               }else{

                   formRules[input.name] = [ruleFunc];
               }
            }  
            // Lang nghe su kien de validate (blur,change)
            input.onblur = handleValidate;
            input.oninput = handleClearError;
        }
        //ham thuc hien validate
        function handleValidate(event){
            var rules = formRules[event.target.name];
            var errorMassage;

         
            rules.some(function (rule){
                errorMassage = rule(event.target.value);
                return errorMassage;
            });

            //neu co loi thi hien thi massage loi ra UI
            if(errorMassage){
                var formGroup =  getParent(event.target, '.form-group');
                if(formGroup){
                    formGroup.classList.add('invalid');
                    var formMessage = formGroup.querySelector('.form-message');
                    if(formMessage){
                        formMessage.innerText = errorMassage;
                    }
                }
            }
            return !errorMassage;
        }
        //ham clear message loi
        function handleClearError(event){
            var formGroup =  getParent(event.target, '.form-group');
            if(formGroup.classList.contains('invalid')){
                formGroup.classList.remove('invalid');

                var formMessage = formGroup.querySelector('.form-message');
                    if(formMessage){
                        formMessage.innerText = '';
                    }
            }
        }
    }

    //xu ly hanh vi submit form
    formElement.onsubmit = function(event){
        event.preventDefault();
        var inputs = formElement.querySelectorAll('[name][rules]');
        var isValid = true;
        for (var input of inputs){
            if(!handleValidate({target: input })){
                isValid = false;
            }
        }
        //khi khong co loi thi submit form
        if (isValid){
            if(typeof options.onSubmit === 'function'){

                var enableInputs = formElement.querySelectorAll('[name]');
                    var formValues = Array.from(enableInputs).reduce(function (values, input) {
                        
                        switch(input.type) {
                            case 'radio':
                                values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                                break;
                            case 'checkbox':
                                if (!input.matches(':checked')) {
                                    values[input.name] = '';
                                    return values;
                                }
                                if (!Array.isArray(values[input.name])) {
                                    values[input.name] = [];
                                }
                                values[input.name].push(input.value);
                                break;
                            case 'file':
                                values[input.name] = input.files;
                                break;
                            default:
                                values[input.name] = input.value;
                        }

                        return values;
                    }, {});
                    //goi lai ham onSubmit va tra ve kem gia tri cua form
                options.onSubmit(formValues);
            }
            else{
                formElement.submit();
            }
        }
    }
}