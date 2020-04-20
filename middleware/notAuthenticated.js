export default function ({ store, redirect }) {
  // If the user is authenticated redirect to home page
  if (!store.state.auth) {
    return redirect('/admin')
  } else {
    return redirect('/admin/dashboard')
  }
}
