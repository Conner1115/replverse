import Swil from 'sweetalert2';
const Positive = Swil.mixin({
  toast: true,
  position: 'bottom-end',
  showConfirmButton: false,
  customClass:{
    popup: "modal-positive"
  },
  timer: 3000,
  showClass: {
    popup: ''
  },
  hideClass: {
    popup: ''
  }
})
const Negative = Swil.mixin({
  toast: true,
  position: 'bottom-end',
  showConfirmButton: false,
  customClass:{
    popup: "modal-negative"
  },
  timer: 3000,
  showClass: {
    popup: ''
  },
  hideClass: {
    popup: ''
  }
})
const hideClass = {
    popup: ''
}, showClass = {popup: ''};
const Swal = Swil.mixin({
  toast: false,
  position: 'top',
  showConfirmButton: false,
  hideClass, showClass
})
export { Swal, Positive, Negative, showClass, hideClass };