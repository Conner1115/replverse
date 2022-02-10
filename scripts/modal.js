import Swal from 'sweetalert2';
const Positive = Swal.mixin({
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
const Negative = Swal.mixin({
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
export { Swal, Positive, Negative, showClass, hideClass };