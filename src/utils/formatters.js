export const formatAppointmentId = (id) =>
  `APT-${new Date().getFullYear()}-${String(id).padStart(4, '0')}`

export const formatStatus = (status) => {
  const map = {
    confirmed:  'Upcoming',
    completed:  'Completed',
    cancelled:  'Cancelled',
    no_show:    'No Show',
  }
  return map[status] || status
}