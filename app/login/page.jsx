import { login, signup } from './actions'

export default function LoginPage({searchParams}) {
  return (
    <>
    <form>
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      <button formAction={login}>Log in</button>
      <div>
       Don&apos;t have an account?{" "}
       <button formAction={signup}>
         Sign Up
       </button>
       {searchParams?.message && (
        <p>
          {searchParams.message}
        </p>
      )}
   </div>
    </form>
    
    </>
    
  )
}