import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect } from "react";
import { Link, useNavigate , useLocation } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2
import axios from "axios";

const SignInLayer = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [verificationMessage, setVerificationMessage] = useState('');
  const navigate = useNavigate();
  const { email, password } = formData;
  const location = useLocation(); 
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('verified') === 'true') {
      setVerificationMessage("You have successfully verified your email!");
    }
  }, [location.search]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5001/api/users/sign-in', formData);
      const { token, role,email } = res.data;
      console.log(res.data);
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('email', email);

      

      // Redirect to FaceRecon component after signing in
      navigate("/face-recon");

    } catch (error) {
      console.error('Error during sign-in:', error.response ? error.response.data : error.message);
      Swal.fire({
        icon: 'error',
        title: 'Invalid Credentials',
        text: error.response ? error.response.data.message : 'Sign-in failed. Please check your email and password.',
        timer: 5000,
        showConfirmButton: true
      });
    }
  };

  return (
    <section className="auth bg-base d-flex flex-wrap">
      <div className="auth-left d-lg-block d-none">
        <div className="d-flex align-items-center flex-column h-100 justify-content-center">
          <img src="/assets/images/signIN.jpg" alt="sign-in" />
        </div>
      </div>
      <div className="auth-right py-32 px-24 d-flex flex-column justify-content-center">
        <div className="max-w-464-px mx-auto w-100">
          <div>
            <h1 className="mb-12" style={{ color: "blue" }}>Finova</h1>
            <h4 className="mb-12">Sign In to your Account</h4>
            <p className="mb-32 text-secondary-light text-lg">
              Welcome back! please enter your details.
            </p>
          </div>
          <form onSubmit={onSubmit}>
            <div className="icon-field mb-16">
              <span className="icon top-50 translate-middle-y">
                <Icon icon="mage:email" />
              </span>
              <input
                type="email"
                className="form-control h-56-px bg-neutral-50 radius-12"
                placeholder="Email"
                name="email"
                value={email}
                onChange={onChange}
                required
              />
            </div>
            <div className="mb-20">
              <div className="position-relative">
                <div className="icon-field">
                  <span className="icon top-50 translate-middle-y">
                    <Icon icon="solar:lock-password-outline" />
                  </span>
                  <input
                    type="password"
                    className="form-control h-56-px bg-neutral-50 radius-12"
                    id="your-password"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    required
                  />
                </div>
                <span
                  className="toggle-password ri-eye-line cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light"
                  data-toggle="#your-password"
                />
              </div>
              <span className="mt-12 text-sm text-secondary-light">
                Your password must have at least 8 characters
              </span>
            </div>
            <button
              type="submit"
              className="btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12 mt-32"
            >
              Sign In
            </button>
            <div className="mt-32 text-center text-sm">
              <p className="mb-0">
                Forgot password{" "}
                <Link to="/forgot-password" className="text-primary-600 fw-semibold">
                  Reset Password
                </Link>
              </p>
            </div>
            <div className="mt-32 center-border-horizontal text-center">
              <span className="bg-base z-1 px-4">Or sign in with</span>
            </div>
            <div className="mt-32 d-flex align-items-center gap-3">
              <button
                type="button"
                className="fw-semibold text-primary-light py-16 px-24 w-50 border radius-12 text-md d-flex align-items-center justify-content-center gap-12 line-height-1 bg-hover-primary-50"
              >
                <Icon
                  icon="ic:baseline-facebook"
                  className="text-primary-600 text-xl line-height-1"
                />
                Facebook
              </button>
              <button
                type="button"
                className="fw-semibold text-primary-light py-16 px-24 w-50 border radius-12 text-md d-flex align-items-center justify-content-center gap-12 line-height-1 bg-hover-primary-50"
              >
                <Icon
                  icon="logos:google-icon"
                  className="text-primary-600 text-xl line-height-1"
                />
                Google
              </button>
            </div>
            <div className="mt-32 text-center text-sm">
              <p className="mb-0">
                Don’t have an account?{" "}
                <Link to="/sign-up" className="text-primary-600 fw-semibold">
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignInLayer;
