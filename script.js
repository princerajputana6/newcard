// Get the modal
var imageModal = document.getElementById('imageModal');
var shareModal = document.getElementById('shareModal');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == imageModal || event.target == shareModal) {
        imageModal.style.display = 'none';
        shareModal.style.display = 'none';
    }
};

// set Country code
const input = document.querySelector('#whatsapp-input');
const iti = window.intlTelInput(input, {
    initialCountry: 'auto',
    geoIpLookup: (success) => {
        fetch('https://ipinfo.io', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                const countryCode = (data && data.country) ? data.country : '';
                success(countryCode);
            });
    },
});

// Get the modal
var imageModal = document.getElementById('imageModal');

const modalImg = document.getElementById('img01');
const captionText = document.getElementById('caption');

function openImageModal(e) {
    imageModal.style.display = 'block';
    modalImg.src = e.src;
    //captionText.innerHTML = e.alt;
}

// Get the <span> element that closes the modal
const imageModalClose = document.getElementById('imageModalClose');

// When the user clicks on <span> (x), close the modal
imageModalClose.onclick = function () {
    imageModal.style.display = 'none';
};


// Get the modal
var shareModal = document.getElementById('shareModal');

function openShareModal(e, title) {
    if (navigator.share) {
        navigator.share({
            title,
            url: window.location.href,
        }).then(() => {
            console.log('Thanks for sharing!');
        })
            .catch(console.error);
    } else {
        shareModal.style.display = 'flex';
    }
}

// Get the <span> element that closes the modal
const shareModalClose = document.getElementById('shareModalClose');

// When the user clicks on <span> (x), close the modal
shareModalClose.onclick = function () {
    shareModal.style.display = 'none';
};

function handleWhatsappShare(e) {
    const { value } = document.getElementById('whatsapp-input');

    if (value.length < 8) {
        e.preventDefault();
        return;
    }
    e.href = `https://wa.me/${iti.getNumber()}?text=${window.location.href}`;
}
function handleDirectWhatsappShare(e, whatsappNumber) {
    if (window.mobileCheck()) {
        e.href = `whatsapp:\/\/send?text=${window.location.href}`;
    } else if (whatsappNumber) {
        e.href = `https://wa.me/91${whatsappNumber}?text=${window.location.href}`;
    } else {
        e.href = `whatsapp:\/\/send?text=${window.location.href}`;
    }
}

function sendEnquiry() {
    let ele = document.getElementById('inquiry-send');
    ele.value = 'Sending...';
    ele.disabled = true;
    const name = document.getElementById('enquiryName');
    const phoneNumber = document.getElementById('phoneNumber');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    const data = {};
    data.mailTo = document.getElementById('companyEmail').value;
    data.name = name.value;
    data.phoneNumber = phoneNumber.value;
    data.email = email.value;
    data.message = message.value;
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState === 4) {
            //const response = JSON.parse(this.response);
            console.log(this.response);
            if (this.status === 200) {
                jQuery.alert({
    						title: "Enquiry sent !",
    						animation: "top",
    						icon: "fa fa-check",
    						confirmButton: "Ok",
    						content: "We received you valuable inquiry, We will contact you soon. Thanks"
    					});
                name.value = '';
                phoneNumber.value = '';
                email.value = '';
                message.value = '';
            } else {
                jQuery.alert({
    						title: "Enquiry fail !",
    						animation: "top",
    						icon: "fa fa-info",
    						confirmButton: "Ok",
    						content: `${response.data.message}`
    					});
            }
            ele.value = 'Send';
            ele.disabled = false;
        }
    };
    xhr.open('POST', '/web-services/companies/sendEnquiry');
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(JSON.stringify(data));
    return false;
}

// Feedback code
const starRatingControl = new StarRating('.star-rating', {
    maxStars: 5,
});

function sendFeedback() {
    let ele = document.getElementById('giveFeedback');
    ele.value = 'Sending...';
    ele.disabled = true;
    const feedbackList = document.getElementsByClassName('feedback-list')[0];
    const rating = document.getElementById('rating');
    const name = document.getElementById('feedbackName');
    const feedback = document.getElementById('feedback');
    const data = {};
    data.cardId = document.getElementById('companyUrl').value;
    data.rating = rating.value;
    data.name = name.value;
    data.feedback = feedback.value;
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState === 4) {
            const response = JSON.parse(this.response);
            console.log(this.response);
            if (this.status === 200) {
                //alert('Success: Feedback Given Successfully');
                jQuery.alert({
    						title: "Feedback Given !",
    						animation: "top",
    						icon: "fa fa-check",
    						confirmButton: "Ok",
    						content: "Feedback Given Successfully"
    					}); 
                rating.value = '';
                name.value = '';
                feedback.value = '';

                // Pushing new feedback in the list
                const feedbackResponse = response.data.feedback;
                const newFeedback = `<div class="feedback-wrapper">
                    <span class="feedback-name-wrapper"><span class="feedback-name">${feedbackResponse.name}</span> on ${feedbackResponse.date} </span>
                    <div><span class="gl-star-rating-stars s${feedbackResponse.rating}0"><span data-value="1" data-text="Terrible"></span><span data-value="2" data-text="Poor"></span><span data-value="3" data-text="Average"></span><span data-value="4" data-text="Very Good"></span><span data-value="5" data-text="Excellent"></span></span></div>
                    <div>${feedbackResponse.feedback}</div>
                    <hr />
                </div>`;
                feedbackList.insertAdjacentHTML('afterbegin', newFeedback);
            } else {
                jQuery.alert({
    						title: "Action fail !",
    						animation: "top",
    						icon: "fa fa-info",
    						confirmButton: "Ok",
    						content: `${response.data.message}`
    					}); 
            }
            ele.value = 'Give Feedback';
            ele.disabled = false;
        }
    };
    xhr.open('POST', '/web-services/companies/feedback');
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(JSON.stringify(data));
}


function sendOrder(orderData) {
    let ele = document.getElementById('btnconfirmOrder');
    ele.value = 'Order Sending...';
    ele.disabled = true;
    // const data = {};
    // data = orderData;
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState === 4) {
            const response = JSON.parse(this.response);
            console.log(response);
            if (this.status === 200) {
                jQuery.alert({
    						title: "Order received!",
    						animation: "top",
    						icon: "fa fa-check",
    						confirmButton: "Ok",
    						backgroundDismiss: false,
    						content: `${response.message}`,
    						confirm: function(){
                    			simpleCart.empty();
                    			clearOrderForm();
                    			closeShopping();	    
    						}
    					});
            } else {
                jQuery.alert({
    						title: "Enquiry fail !",
    						animation: "top",
    						icon: "fa fa-info",
    						confirmButton: "Ok",
    						content: `${response.message}`
    					});
            }
            ele.value = 'Complete Order';
            ele.disabled = false;
        }
    };
    xhr.open('POST', '/web-services/companies/sendOrder');
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(JSON.stringify(orderData));
    return false;
}

function clearOrderForm(){
    document.getElementById('companyId').value = "";
    document.getElementById('Email_Id').value = "";
    document.getElementById('Full_Name').value = "";
    document.getElementById('Mobile_No').value = "";
    document.getElementById('State').value = "";
    document.getElementById('City_Name').value = "";
    document.getElementById('Pin_Code').value = "";
    document.getElementById('Address').value = "";
    document.getElementById('paymentMode').value = "";
    document.getElementById('razorpay_payment_id').value = "";
}