import Swal from 'sweetalert2'
//icon : warning, error, success, info, and question

const timer = 2500;
const width = 200;
const imageWidth = '50px';

export const successNotification = (message) => Swal.fire({
  position: 'top-end',
  icon: 'success',
  title: `${'<span style="font-size:14px">'}${message}${'<span>'}`,
  showConfirmButton: false,
  imageWidth,
  width,
  timer
});

export const successHomeNotification = (message) => Swal.fire({
  position: 'center',
  icon: 'success',
  title: `${'<span style="font-size:14px">'}${message}${'<span>'}`,
  showConfirmButton: false,
  imageWidth,
  width,
  timer
});

export const errorNotification = (message) => Swal.fire({
  position: 'top-end',
  icon: 'error',
  title: `${'<span style="font-size:14px">'}${message}${'<span>'}`,
  showConfirmButton: false,
  width,
  imageWidth,
  timer
});

export const warningNotification = (message) => Swal.fire({
  position: 'top-end',
  icon: 'warning',
  title: `${'<span style="font-size:14px">'}${message}${'<span>'}`,
  showConfirmButton: false,
  width,
  imageWidth,
  timer
});

export const infoNotification = (message) => Swal.fire({
  position: 'top-end',
  icon: 'info',
  title: `${'<span style="font-size:14px">'}${message}${'<span>'}`,
  showConfirmButton: false,
  width,
  imageWidth,
  timer
});

export const errorPopUp = (message) => Swal.fire({
  title: '<span style="color:var(--danger)">Error!</span>',
  text: message,
  showConfirmButton: false,
  showCancelButton: true,
  reverseButtons: true,
  showCloseButton: true,
  customClass:"mycustom-alert",
  cancelButtonClass: 'cancel-alert-note',
  cancelButtonText: 'Ok',
})

export const errorContactDeletePopUp = (message) => Swal.fire({
  title: '<span style="color:var(--danger)">Sorry, cannot delete contact.</span>',
  text: message,
  showConfirmButton: false,
  showCancelButton: true,
  reverseButtons: true,
  showCloseButton: true,
  customClass:"mycustom-alert",
  cancelButtonClass: 'cancel-alert-note',
  cancelButtonText: 'Ok',
})