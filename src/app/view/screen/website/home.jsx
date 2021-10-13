import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import BANNER_IMG4 from '../../../../app/assets/website/images/banner-img-4.jpg'
import BANNER_IMG1 from '../../../../app/assets/website/images/banner-img-1.jpg'
import BANNER_IMG6 from '../../../../app/assets/website/images/banner-img-6.jpg'
import BANNER_IMG3 from '../../../../app/assets/website/images/banner-img-3.jpg'
import BANNER_IMG5 from '../../../../app/assets/website/images/banner-img-5.jpg'
import BANNER_IMG2 from '../../../../app/assets/website/images/banner-img-2.jpg'
import LEADS_ICON from '../../../../app/assets/website/images/leads-icn.svg'
import QUOTE_ICON from '../../../../app/assets/website/images/quotes-icn.svg'
import PAYMENT_ICON from '../../../../app/assets/website/images/payment-icn.svg'
import INVOICE_ICON from '../../../../app/assets/website/images/invoices-icn.svg'
import BOOKING_ICON from '../../../../app/assets/website/images/booking-icn.svg'
import HOW_TO_WORK1 from '../../../../app/assets/website/images/howItWorks-img1.jpg'
import HOW_TO_WORK2 from '../../../../app/assets/website/images/howItWorks-img2.jpg'
import HOW_TO_WORK3 from '../../../../app/assets/website/images/howItWorks-img3.jpg'
import HOW_TO_WORK4 from '../../../../app/assets/website/images/howItWorks-img4.jpg'
import HOW_TO_WORK5 from '../../../../app/assets/website/images/howItWorks-img5.jpg'
import LEADS_ICN from '../../../../app/assets/website/images/leads-icon.svg'
import CONTACT_IMG1 from '../../../../app/assets/website/images/contacts-img1.jpg'
import CONTACT_IMG2 from '../../../../app/assets/website/images/contacts-img2.jpg'
import CONTACT_IMG3 from '../../../../app/assets/website/images/contacts-img3.jpg'
import ADDRESS_CONTACT from '../../../../app/assets/website/images/address-contact.svg'
import ORANGE_CHECK from '../../../../app/assets/website/images/orange-check.svg'
import INFO_ICN from '../../../../app/assets/website/images/info-icn.svg'
import FAQ_IMG1 from '../../../../app/assets/website/images/faq-img1.jpg'
import FAQ_IMG2 from '../../../../app/assets/website/images/faq-img2.jpg'
import FAQ_IMG3 from '../../../../app/assets/website/images/faq-img3.jpg'
import CONTACT_ICN from '../../../../app/assets/website/images/contact-icon.svg'
import LEADS_IMG1 from '../../../../app/assets/website/images/leads-img1.jpg'
import LEADS_IMG2 from '../../../../app/assets/website/images/leads-img2.jpg'
import LEADS_IMG3 from '../../../../app/assets/website/images/leads-img3.jpg'
import QUOTE_IMG1 from '../../../../app/assets/website/images/quotes-img1.jpg'
import QUOTE_IMG2 from '../../../../app/assets/website/images/quotes-img2.jpg'
import QUOTE_IMG3 from '../../../../app/assets/website/images/quotes-img3.jpg'
import QUOTE_ICN from '../../../../app/assets/website/images/quotes-icon.svg'
import INVOICE_IMG1 from '../../../../app/assets/website/images/invoices-img1.jpg'
import INVOICE_IMG2 from '../../../../app/assets/website/images/invoices-img2.jpg'
import INVOICE_IMG3 from '../../../../app/assets/website/images/invoices-img3.jpg'
import INVOICE_PAYMENT from '../../../../app/assets/website/images/invoices-payments-icon.svg'
import BOOKINGS_IMG1 from '../../../../app/assets/website/images/bookings-img1.jpg'
import BOOKINGS_IMG2 from '../../../../app/assets/website/images/bookings-img2.jpg'
import BOOKINGS_IMG3 from '../../../../app/assets/website/images/bookings-img3.jpg'
import BOOKINGS_ICN from '../../../../app/assets/website/images/bookings-icon.svg'
import PHONE_SLIDE1 from '../../../../app/assets/website/images/booking-slide1.jpg'
import PHONE_SLIDE2 from '../../../../app/assets/website/images/booking-slide2.jpg'
import IPHONE_MOCKUP from '../../../../app/assets/website/images/iphone-mockup.png'
import TAXI_GROW from '../../../../app/assets/website/images/1taxi-cant-grow 2.jpg'
import { fieldValidator, setImagePath, usePrevious } from '../../../common/custom';
import AOS from 'aos';
import "aos/dist/aos.css";
import Select from 'react-select';
import { validateInputs } from "../../../common/validation";
import { constants, selectStyle } from "../../../common/constants";
import { contactUsForm } from "../../../duck/website/website.action";
import Swiper, { Navigation, Pagination, Autoplay } from 'swiper';
import { Header } from '../../component/website/header/header'
import { Footer } from '../../component/website/footer/footer'
import _ from 'lodash';
import ReactTooltip from 'react-tooltip';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { LOGIN, REGISTER } from '../../../routing/routeContants'
import { Link } from 'react-router-dom'

export const Home = (props) => {
	const swiper = useRef(null)
	const dispatch = useDispatch();
	const [loader, setLoader] = useState(false);
	const [serviceMessage, setServiceMessage] = useState('');
	const [visibleSection, setVisibleSection] = useState();
	const [state, setState] = useState({
		firstName: '', lastName: '', email: '', phone: '', reason: '', reasonOptions: [{ value: 'Would like a demo of the product', label: 'Would like a demo of the product' }, { value: 'Need help setting up my account', label: 'Need help setting up my account' }, 
		{ value: 'Don’t know how to use the application, need guidance', label: 'Don’t know how to use the application, need guidance' }, { value: 'Request new features', label: 'Request new features' }, { value: 'Facing issues with my account', label: 'Facing issues with my account' }, { value: 'Other', label: 'Other' }], 
		additionalInformation: '', firstNameCls: '', lastNameCls: '', emailCls: '', phoneCls: '', additionalInformationCls: '', firstNameErr: '', lastNameErr: '', emailErr: '', phoneErr: '', additionalInformationErr: '', correctInput: '', wrongInput: constants.WRONG_INPUT,
	});

	const contactUsFormData = useSelector(state => state.website.contactUsFormData);
	const prevContactUsFormData = usePrevious({ contactUsFormData });

	const headerRef = useRef(null);
	const howItWorksRef = useRef(null);
	const featureRef = useRef(null);
	const planRef = useRef(null);
	const faqRef = useRef(null);
	const contactRef = useRef(null);

	const sectionRefs = [
		{ section: "howItWorks", ref: howItWorksRef },
		{ section: "feature", ref: featureRef },
		{ section: "plan", ref: planRef },
		{ section: "faq", ref: faqRef },
		{ section: "contact", ref: contactRef },
	];

	const getDimensions = ele => {
		const { height } = ele.getBoundingClientRect();
		const offsetTop = ele.offsetTop;
		const offsetBottom = offsetTop + height;

		return {
			height,
			offsetTop,
			offsetBottom,
		};
	};

	const scrollTo = ele => {
		switch (ele) {
			case 'howItWorksRef':
				return howItWorksRef.current.scrollIntoView({
					behavior: "smooth",
					block: "start",
				});
			case 'featureRef':
				return featureRef.current.scrollIntoView({
					behavior: "smooth",
					block: "start",
				});
			case 'planRef':
				return planRef.current.scrollIntoView({
					behavior: "smooth",
					block: "start",
				});
			case 'faqRef':
				return faqRef.current.scrollIntoView({
					behavior: "smooth",
					block: "start",
				});
			case 'contactRef':
				return contactRef.current.scrollIntoView({
					behavior: "smooth",
					block: "start",
				});
			default:
				return window.scrollTo(0, 0)																	
		}

	};

	useEffect(() => {
		const handleScroll = () => {
			const { height: headerHeight } = getDimensions(headerRef.current);
			const scrollPosition = window.scrollY + headerHeight;

			const selected = sectionRefs.find(({ section, ref }) => {
				const ele = ref.current;
				if (ele) {
					const { offsetBottom, offsetTop } = getDimensions(ele);
					return scrollPosition > offsetTop && scrollPosition < offsetBottom;
				}
			});

			if (selected && selected.section !== visibleSection) {
				setVisibleSection(selected.section);
			} else if (!selected && visibleSection) {
				setVisibleSection(undefined);
			}
		};

		handleScroll();
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [visibleSection]);// eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		Swiper.use([Navigation, Pagination, Autoplay]);
		AOS.init();
		AOS.refresh();
		swiper.current = new Swiper('.homebanner-slider', {
			slidesPerView: 1,
			spaceBetween: 0,
			centeredSlides: false,
			navigation: false,
			loop: true,
			slideToClickedSlide: true,
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
			},
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
			},
			breakpoints: {
				640: {
					slidesPerView: 2,
					spaceBetween: 15,
				},
				1024: {
					slidesPerView: 2,
					spaceBetween: 15,
				},
				1921: {
					slidesPerView: 3,
					spaceBetween: 20,
					navigation: false,
				},
			}
		})
		swiper.current = new Swiper('.iphone-slider', {
			slidesPerView: 1,
			spaceBetween: 0,
			centeredSlides: true,
			slideToClickedSlide: true,
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
			}
		})
	}, []);

	useEffect(() => {
		if (prevContactUsFormData && prevContactUsFormData.contactUsFormData !== contactUsFormData) {
			if (contactUsFormData && _.has(contactUsFormData, 'data') && contactUsFormData.success === true) {
				resetForm();
				setLoader(false)
			}
			if (contactUsFormData && _.has(contactUsFormData, 'message') && contactUsFormData.success === false) {
				setServiceMessage(contactUsFormData.message)
				setLoader(false)
			}
		}
	}, [prevContactUsFormData, contactUsFormData])// eslint-disable-line react-hooks/exhaustive-deps

	// Set The Input Values
	const setInputValue = (e, type, maxLength, minLength) => {
		let error = checkValidation(e.target.name, e.target.value, type, maxLength, minLength)
		setState({ ...state, [e.target.name]: e.target.value, [error.fieldNameErr]: error.errorMsg, [error.fieldCls]: error.setClassName });
	}

	// Check Validation Function 
	const checkValidation = (field, value, type, maxLength, minLength, fieldType) => {
		return fieldValidator(field, value, type, null, maxLength, minLength, fieldType)
	}

	// Reset Form Data
	const resetForm = () => {
		setState({
			...state, firstName: '', lastName: '', email: '', phone: '', reason: '', additionalInformation: '',
			firstNameCls: '', lastNameCls: '', emailCls: '', phoneCls: '', additionalInformationCls: '', firstNameErr: '',
			lastNameErr: '', emailErr: '', phoneErr: '', additionalInformationErr: ''
		})
	}

	const submitContactUsForm = (e) => {
		e.preventDefault();
		let error = state.wrongInput;
		let firstName = state.firstName, lastName = state.lastName, email = state.email, phone = state.phone, reason = state.reason.value, additionalInformation = state.additionalInformation,
			firstNameCls = '', lastNameCls = '', emailCls = '', phoneCls = '', firstNameErr = '', lastNameErr = '', emailErr = '', phoneErr = '',
			getError = false;

		if (validateInputs('string', firstName) === 'empty') {
			firstNameErr = 'Please enter first name.';
			firstNameCls = error
			getError = true;
		} else if (validateInputs('string', firstName) === false) {
			firstNameErr = 'Please enter valid first name.';
			firstNameCls = error
			getError = true;
		} else if (firstName.length > 50) {
			firstNameErr = 'Please enter maximum 50 characters.';
			firstNameCls = error
			getError = true;
		}

		if (validateInputs('string', lastName) === 'empty') {
			lastNameErr = 'Please enter last name.';
			lastNameCls = error
			getError = true;
		} else if (validateInputs('string', lastName) === false) {
			lastNameErr = 'Please enter valid last name.';
			lastNameCls = error
			getError = true;
		} else if (lastName.length > 50) {
			lastNameErr = 'Please enter maximum 50 characters.';
			lastNameCls = error
			getError = true;
		}

		if (validateInputs('email', email) === 'empty') {
			emailErr = 'Please enter email.';
			emailCls = error
			getError = true;
		} else if (validateInputs('email', email) === false) {
			emailErr = 'Please enter valid email.';
			emailCls = error
			getError = true;
		}

		if (validateInputs('phoneNumberHyphon', phone) === false) {
			phoneErr = 'Please enter valid phone.';
			phoneCls = error
			getError = true;
		}
		if (phone && phone.length > 1 && phone.length > 15) {
			phoneErr = 'Please enter maximum 15 digits.';
			phoneCls = error
			getError = true;
		}

		setState({
			...state, firstNameCls, lastNameCls, emailCls, phoneCls, firstNameErr, lastNameErr, emailErr, phoneErr,
		})
		if (getError === false && firstNameErr === '' && lastNameErr === '' && emailErr === '' && phoneErr === '') {
			let formData = { first_name: firstName, last_name: lastName, email, phone, reason, info: additionalInformation }
			setLoader(true)
			dispatch(contactUsForm(formData));
		}
	}

	return (
		<div className="bizz-website-wrap">
			<Header headRef={headerRef} scrollTo={(data) => scrollTo(data)} classAtive={visibleSection}/>
			<main>
			
			<section className="home-banner">
				<svg className="home-banner-curve-top" xmlns="http://www.w3.org/2000/svg" width="798.196" height="24.679" viewBox="0 0 798.196 24.679">
				<path id="Path_1" data-name="Path 1" d="M37.814,199s42.94,3.742,151.794,15.756S393.846,226.769,570,214s262.766-15.135,266-15S37.814,199,37.814,199Z" transform="translate(-37.814 -198.995)" fill="#fff"/>
				</svg>
				<div className="home-banner--slider">
				<div className="swiper-container homebanner-slider">
					<div className="swiper-wrapper">
					<div className="swiper-slide" data-aos="fade-left" data-aos-duration="1000"><img className="img-fluid" src={setImagePath(BANNER_IMG4)} alt=""/><div className="slide-caption">DJs & Equipment Rentals</div></div>
					<div className="swiper-slide" data-aos="fade-left" data-aos-duration="2000"><img className="img-fluid" src={setImagePath(BANNER_IMG6)} alt=""/><div className="slide-caption">Caterers & Florists</div></div>
					<div className="swiper-slide" data-aos="fade-left" data-aos-duration="3000"><img className="img-fluid" src={setImagePath(BANNER_IMG3)} alt="" /><div className="slide-caption">Performers & Artists</div></div>
					<div className="swiper-slide" data-aos="fade-left" data-aos-duration="4000"><img className="img-fluid" src={setImagePath(BANNER_IMG5)} alt="" /><div className="slide-caption">Decorators & Wedding Services </div></div>
					<div className="swiper-slide" data-aos="fade-left" data-aos-duration="5000"><img className="img-fluid" src={setImagePath(BANNER_IMG2)} alt="" /><div className="slide-caption">Photographers</div></div>
					<div className="swiper-slide" data-aos="fade-left" data-aos-duration="6000"><img className="img-fluid" src={setImagePath(BANNER_IMG1)} alt="" /><div className="slide-caption">Singers & Musicians</div></div>
					</div>
					<div className="swiper-pagination"></div>
				</div>
				</div>
				<div className="home-banner-content">
				<div className="container">
					<div className="row align-items-center">            
					<div className="col-md-6">
						<h1 className="banner-title" data-aos="fade-right" data-aos-duration="1000">Manage your services business online</h1>
						<h4 className="banner-subtitle" data-aos="fade-right" data-aos-duration="1500">One stop solution to manage lead-to-cash activities and grow your business</h4>
						<div className="home-banner-btns" data-aos="fade-right" data-aos-duration="2000">
						<div className="banner-start-tr-btn">
							<Link to={REGISTER} className="btn btn-primary font-weight-bold">Start 3 Months FREE Trial</Link>
							<p className=" text-center">Already a customer?  <Link to={LOGIN}>Sign In</Link></p>
						</div>
						<p className="ml-3">Credit card NOT required</p>
						</div>
					</div>
					</div>
				</div>
				</div>
				<svg className="home-banner-curve-bottom" xmlns="http://www.w3.org/2000/svg" width="798.196" height="24.679" viewBox="0 0 798.196 24.679">
				<path id="Path_1" data-name="Path 1" d="M37.814,199s42.94,3.742,151.794,15.756S393.846,226.769,570,214s262.766-15.135,266-15S37.814,199,37.814,199Z" transform="translate(-37.814 -198.995)" fill="#fff"/>
				</svg>
			</section>

			<section className="page-section" id="howItWorks" ref={howItWorksRef} offset="50">
				<div className="container">
					<h2 className="howItWorks-title" data-aos="fade-up" data-aos-duration="500" data-aos-offset="100">
						<span>GET ORGANIZED<sup>.</sup></span>
						<span>SAVE TIME<sup>.</sup></span>
						<span>GROW BUSINESS<sup>.</sup></span>
					</h2>
				</div>  
				<svg className="sec-wave-svg" xmlns="http://www.w3.org/2000/svg" width="2500" height="36.518" viewBox="0 0 2500 36.518">
				<path id="Path_1" data-name="Path 1" d="M1342,1366.546s-271.774,39.418-600.684,9.357-410.687-13.516-693.49,2.079-341.026,15.6-655.02-12.477-515.69,10.444-550.764,11.062c-.1-.022,0,7.176,0,7.176v8.047H1342Z" transform="translate(1158 -1355.273)" fill="#eaf8f8"/>
				</svg>


				<div className="howItWorks-wrap">
				<div className="container">
					<div className="row">
					<div className="col-lg col-md-4">
						<div className="howItWorks-points" data-aos="fade-up" data-aos-delay="300" data-aos-offset="50">
						<div className="howItWorks-icon"><LazyLoadImage src={setImagePath(LEADS_ICON)} alt="" /></div><h4>Leads</h4><p>Manage contacts <br />& leads</p>
						</div>
					</div>
					<div className="col-lg col-md-4">
						<div className="howItWorks-points" data-aos="fade-up" data-aos-delay="400" data-aos-offset="60">
						<div className="howItWorks-icon"><LazyLoadImage src={setImagePath(QUOTE_ICON)} alt="" /></div><h4>Quotes</h4><p>Send electronic quotes & collect e-signatures</p>
						</div>
					</div>
					<div className="col-lg col-md-4">
						<div className="howItWorks-points" data-aos="fade-up" data-aos-delay="500" data-aos-offset="70">
						<div className="howItWorks-icon"><LazyLoadImage src={setImagePath(PAYMENT_ICON)} alt="" /></div><h4>Payments</h4><p>Collect deposits or payments</p>
						</div>
					</div>
					<div className="col-lg col-md-4">
						<div className="howItWorks-points" data-aos="fade-up" data-aos-delay="600" data-aos-offset="80">
						<div className="howItWorks-icon"><LazyLoadImage src={setImagePath(INVOICE_ICON)} alt="" /></div><h4>Invoices</h4><p>Send digital invoices</p>
						</div>
					</div>
					<div className="col-lg col-md-4">
						<div className="howItWorks-points" data-aos="fade-up" data-aos-delay="700" data-aos-offset="90">
						<div className="howItWorks-icon"><LazyLoadImage src={setImagePath(BOOKING_ICON)} alt="" /></div><h4>Bookings</h4><p>Manage bookings & deliver service</p>
						</div>
					</div>
					</div>
				</div>
				</div>
				<svg className=" sec-wave-svg" xmlns="http://www.w3.org/2000/svg" width="2500" height="40.213" viewBox="0 0 2500 40.213">
				<path id="Path_1" data-name="Path 1" d="M-1158,1385.178s328.969-43.928,657.879-13.867,406.3,24.41,701.79,0,293.732-12.11,629.677,0,475.537-3.891,510.612-4.509c.1.022,0-7.176,0-7.176v-8.047H-1158Z" transform="translate(1158 -1351.579)" fill="#eaf8f8"/>
				</svg>
				<div className="container">
				<div className="row justify-content-center" data-aos="fade-up">
					<div className="col-xl-8 p-lg-0 col-lg-9 col-md-11">
					<h4 className="text-center heading-color mt-5 font-weight-bold">MyBizzHive helps service providers manage new leads or potential customers and serve existing customers seamlessly.</h4>
					</div>
				</div>
				</div>
				<div className="howItWorks-badges">
				<div className="container text-center">
					<span className="badge" data-aos="flip-up">Artists & Performers</span> 
					<span className="badge" data-aos="flip-up">Bartenders</span> 
					<span className="badge" data-aos="flip-up">Costumed Characters</span> 
					<span className="badge" data-aos="flip-up">Caterers</span> 
					<span className="badge" data-aos="flip-up">DJs & Equipment Rentals</span> 
					<span className="badge" data-aos="flip-up">Decorators </span> 
					<span className="badge" data-aos="flip-up">Entertainers</span>
					<span className="badge" data-aos="flip-up">Event Management </span>
					<span className="badge" data-aos="flip-up">Florists</span>
					<span className="badge" data-aos="flip-up">Magicians</span>
					<span className="badge" data-aos="flip-up">Make up Artists</span>
					<span className="badge" data-aos="flip-up">Performers</span>
					<span className="badge" data-aos="flip-up">Photographers</span>
					<span className="badge" data-aos="flip-up">Puppet Shows</span>
					<span className="badge" data-aos="flip-up">Singers & Musicians</span>
					<span className="badge" data-aos="flip-up">Wedding Services</span>
					<span className="badge" data-aos="flip-up">Cleaning Services</span>
					<span className="badge" data-aos="flip-up">Construction Services</span>
					<span className="badge" data-aos="flip-up">Freelancers</span>
					<span className="badge" data-aos="flip-up">Handyman</span>
					<span className="badge" data-aos="flip-up">Painters</span>
					<span className="badge badge-last" data-aos="flip-up">And many more...</span>
				</div>
				</div>

				<div className="howItWorks-lists">
				<div className="container">
					<div className="row justify-content-between">
					<div className="col-lg-6" data-aos="fade-right" data-aos-delay="300">
						<div className="howItWorks-collage">
						<LazyLoadImage className="img-1 img-fluid" src={setImagePath(HOW_TO_WORK1)} alt="" data-aos="zoom-out" />
						<LazyLoadImage className="img-2" src={setImagePath(HOW_TO_WORK2)} alt="" data-aos="zoom-out" />
						<LazyLoadImage className="img-3" src={setImagePath(HOW_TO_WORK3)} alt="" data-aos="zoom-out" />
						<LazyLoadImage className="img-4" src={setImagePath(HOW_TO_WORK4)} alt="" data-aos="zoom-out" />
						<LazyLoadImage className="img-5" src={setImagePath(HOW_TO_WORK5)} alt="" data-aos="zoom-out" />
						</div>
					</div>
					<div className="col-xl-5 col-lg-6 pt-2" data-aos="fade-left" data-aos-delay="400">
						<ul className="section-listings">
						<li><p>No set up required</p> <small>(Create free account and start using)</small></li>
						<li><p>Customizable</p> <small>(Match with your process and terminology, takes only few minutes)</small></li>
						<li><p>Secure</p> <small>(We won’t share your data with any third-party, ever!)</small></li>
						<li><p>Accessible</p> <small>(Use any device to access your account, no app needed)</small></li>
						<li><p>Pick a plan matching your needs</p> <small>(Upgrade anytime)</small></li>
						<li><p>Great customer service</p></li>
						</ul>
					</div>
					</div>
				</div>
				</div>

			</section>

			<div ref={featureRef}>
			<section className="page-section" id="contactSection" offset="660"  >
				<svg className="sec-svg-rotate sec-wave-svg" xmlns="http://www.w3.org/2000/svg" width="2500" height="36.518" viewBox="0 0 2500 36.518">
				<path id="Path_1" data-name="Path 1" d="M1342,1366.546s-271.774,39.418-600.684,9.357-410.687-13.516-693.49,2.079-341.026,15.6-655.02-12.477-515.69,10.444-550.764,11.062c-.1-.022,0,7.176,0,7.176v8.047H1342Z" transform="translate(1158 -1355.273)" fill="#eaf8f8"/>
				</svg>
				<div className="contactSection-wrap" id="featureSection">
				<div className="container">
					<div className="row justify-content-between">
					<div className="col-md-6" data-aos="fade-left" data-aos-delay="400">
						<div className="sec-heading d-lg-none">
						<LazyLoadImage src={setImagePath(LEADS_ICN)} alt="" />
						<h3 className="mt-4">Contacts</h3>
						</div>
						<div className="contactSection-collage">
						<LazyLoadImage className="img-1 img-fluid" src={setImagePath(CONTACT_IMG1)} alt="" data-aos="zoom-out" />
						<LazyLoadImage className="img-2" src={setImagePath(CONTACT_IMG2)} alt="" data-aos="zoom-out" />
						<LazyLoadImage className="img-3" src={setImagePath(CONTACT_IMG3)} alt="" data-aos="zoom-out" />
						</div>
					</div>
					<div className="col-xl-5 col-lg-6 order-md-first" data-aos="fade-right" data-aos-delay="300">
						<div className="sec-heading d-none d-lg-flex">
						<LazyLoadImage src={setImagePath(ADDRESS_CONTACT)} alt="" />
						<h3>Contacts</h3>
						</div>              
						<ul className="section-listings">
						<li><p>Manage all your contacts in one place</p></li>
						<li><p>Stay organized and be on top of the things</p> <small>(with follow-up tasks, reminders & notes)</small></li>
						<li><p>Import all your contacts</p> <small>(Create one respository)</small></li>
						<li><p>Create new business contacts automatically</p> <small>(when you receive messages from new clients from your website or email)</small></li>
						<li><p>Minimal or no data entry</p></li>
						</ul>
						<a data-aos="fade-up-right" data-aos-offset="50"  href="#email" onClick={(e) => e.preventDefault()} className="link-primary ms-4">Learn more</a>
					</div>
					</div>
				</div>
				</div>
				<svg className="sec-svg-rotate sec-wave-svg" xmlns="http://www.w3.org/2000/svg" width="2500" height="40.213" viewBox="0 0 2500 40.213">
				<path id="Path_1" data-name="Path 1" d="M-1158,1385.178s328.969-43.928,657.879-13.867,406.3,24.41,701.79,0,293.732-12.11,629.677,0,475.537-3.891,510.612-4.509c.1.022,0-7.176,0-7.176v-8.047H-1158Z" transform="translate(1158 -1351.579)" fill="#eaf8f8"/>
				</svg>
			</section>


			<section className="page-section" id="leadsSection" >
				<div className="leadsSection-wrap">
				<div className="container">
					<div className="row justify-content-between">
					<div className="col-md-6" data-aos="fade-right" data-aos-delay="300">
						<div className="sec-heading d-lg-none">
						<LazyLoadImage src={setImagePath(LEADS_ICN)} alt="" />
						<h3 className="mt-4">Leads</h3>
						</div>
						<div className="leadsSection-collage">
						<LazyLoadImage className="img-1 img-fluid" src={setImagePath(LEADS_IMG1)} alt="" data-aos="zoom-out" />
						<LazyLoadImage className="img-2" src={setImagePath(LEADS_IMG2)} alt="" data-aos="zoom-out" />
						<LazyLoadImage className="img-3" src={setImagePath(LEADS_IMG3)} alt="" data-aos="zoom-out" />
						</div>
					</div>
					<div className="col-xl-5 col-lg-6" data-aos="fade-left" data-aos-delay="400">
						<div className="sec-heading d-none d-lg-flex">
						<LazyLoadImage src={setImagePath(LEADS_ICN)} alt="" />
						<h3 className="mt-4">Leads</h3>
						</div>              
						<ul className="section-listings">
						<li><p>An end-to-end view of all current customers</p> <small>(On one screen)</small></li>
						<li><p>Customize Leads board to match your process</p> <small>(Take less than one minute!)</small></li>
						<li><p>Create new leads automatically</p> <small>(when new clients contact via your website or email)</small></li>
						<li><p>Stay organized and be on top of the things</p> <small>(Follow-up tasks, reminders & notes)</small></li>
						<li><p>Minimal or no data entry</p></li>
						</ul>
						<a data-aos="fade-up-right" data-aos-offset="50"  href="#email" onClick={(e) => e.preventDefault()} className="link-primary ms-4">Learn more</a>
					</div>
					</div>
				</div>
				</div>
			</section>


			<section className="page-section" id="quotesSection" >
				<svg className="sec-svg-rotate sec-wave-svg" xmlns="http://www.w3.org/2000/svg" width="2500" height="36.518" viewBox="0 0 2500 36.518">
				<path id="Path_1" data-name="Path 1" d="M1342,1366.546s-271.774,39.418-600.684,9.357-410.687-13.516-693.49,2.079-341.026,15.6-655.02-12.477-515.69,10.444-550.764,11.062c-.1-.022,0,7.176,0,7.176v8.047H1342Z" transform="translate(1158 -1355.273)" fill="#eaf8f8"/>
				</svg>
				<div className="quotesSection-wrap">
				<div className="container">
					<div className="row justify-content-between">
					<div className="col-md-6" data-aos="fade-left" data-aos-delay="400">
						<div className="sec-heading d-lg-none">
						<LazyLoadImage src={setImagePath(LEADS_ICN)} alt="" />
						<h3 className="mt-4">Quotes</h3>
						</div>
						<div className="quotesSection-collage">
						<LazyLoadImage className="img-1 img-fluid" src={setImagePath(QUOTE_IMG1)} alt="" data-aos="zoom-out" />
						<LazyLoadImage className="img-2" src={setImagePath(QUOTE_IMG2)} alt="" data-aos="zoom-out" />
						<LazyLoadImage className="img-3" src={setImagePath(QUOTE_IMG3)} alt="" data-aos="zoom-out" />
						</div>
					</div>
					<div className="col-xl-5 col-lg-6 order-md-first" data-aos="fade-right" data-aos-delay="300">
						<div className="sec-heading d-none d-lg-flex">
						<LazyLoadImage src={setImagePath(QUOTE_ICN)} alt="" />
						<h3>Quotes</h3>
						</div>              
						<ul className="section-listings">
							<li><p>Add services & pricing details</p> <small>(Create packages and define terms)</small></li>
							<li><p>Create customizable quotes</p> <small>(Create templates for repeat use)</small></li>
							<li><p>Send digital quotes via email</p> <small>(Collect electronic signatures)</small></li>
							<li><p>Get notifications</p> <small>(When customers accept quote or pay deposit)</small></li>
							<li><p>Automatically update your bookings schedule</p></li>
							<li><p>Generate invoices</p></li>
						</ul>
						<a data-aos="fade-up-right" data-aos-offset="50"  href="#email" onClick={(e) => e.preventDefault()} className="link-primary ms-4">Learn more</a>
					</div>
					</div>
				</div>
				</div>
				<svg className="sec-svg-rotate sec-wave-svg" xmlns="http://www.w3.org/2000/svg" width="2500" height="40.213" viewBox="0 0 2500 40.213">
				<path id="Path_1" data-name="Path 1" d="M-1158,1385.178s328.969-43.928,657.879-13.867,406.3,24.41,701.79,0,293.732-12.11,629.677,0,475.537-3.891,510.612-4.509c.1.022,0-7.176,0-7.176v-8.047H-1158Z" transform="translate(1158 -1351.579)" fill="#eaf8f8"/>
				</svg>
			</section>
			
			
			<section className="page-section" id="invoiceSection" >
				<div className="leadsSection-wrap">
				<div className="container">
					<div className="row justify-content-between">
					<div className="col-md-6" data-aos="fade-right" data-aos-delay="300">
						<div className="sec-heading d-lg-none">
						<LazyLoadImage src={setImagePath(LEADS_ICN)} alt="" />
						<h3 className="mt-4">Invoices & payments</h3> 
						</div>
						<div className="invoiceSection-collage">
						<LazyLoadImage className="img-1 img-fluid" src={setImagePath(INVOICE_IMG1)} alt="" data-aos="zoom-out" />
						<LazyLoadImage className="img-2" src={setImagePath(INVOICE_IMG2)} alt="" data-aos="zoom-out" />
						<LazyLoadImage className="img-3" src={setImagePath(INVOICE_IMG3 )} alt="" data-aos="zoom-out" />
						</div>
					</div>
					<div className="col-xl-5 col-lg-6" data-aos="fade-left" data-aos-delay="400">
						<div className="sec-heading d-none d-lg-flex">
						<LazyLoadImage src={setImagePath(INVOICE_PAYMENT)} alt="" />
						<h3 className="mt-4">Invoices & payments</h3>
						</div>              
						<ul className="section-listings">
						<li><p>Add services & pricing details</p> <small>(Create packages and define terms)</small></li>
						<li><p>Create customizable invoices</p> <small>(Create templates for repeat use)</small></li>
						<li><p>Send digital invoices via email</p></li>
						<li><p>Collect payments and deposits</p> <small>(Use your PayPal, no additional processing fees!)</small></li>
						<li><p>Get notifications</p> <small>(When customers make payments)</small></li>
						<li>Download PDFs</li>
						</ul>
						<a data-aos="fade-up-right" data-aos-offset="50"  href="#email" onClick={(e) => e.preventDefault()} className="link-primary ms-4">Learn more</a>
					</div>
					</div>
				</div>
				</div>
			</section>
			
			
			<section className="page-section" id="bookingsSection" >
				<svg className="sec-svg-rotate sec-wave-svg" xmlns="http://www.w3.org/2000/svg" width="2500" height="36.518" viewBox="0 0 2500 36.518">
				<path id="Path_1" data-name="Path 1" d="M1342,1366.546s-271.774,39.418-600.684,9.357-410.687-13.516-693.49,2.079-341.026,15.6-655.02-12.477-515.69,10.444-550.764,11.062c-.1-.022,0,7.176,0,7.176v8.047H1342Z" transform="translate(1158 -1355.273)" fill="#eaf8f8"/>
				</svg>
				<div className="quotesSection-wrap">
				<div className="container">
					<div className="row justify-content-between">
					<div className="col-md-6" data-aos="fade-left" data-aos-delay="300">
						<div className="sec-heading d-lg-none">
						<LazyLoadImage src={setImagePath(LEADS_ICN)} alt="" />
						<h3 className="mt-4">Bookings</h3>
						</div>
						<div className="bookingsiphone-slider">
						<div className="iphone-slider-wrap" data-aos="zoom-out">
							<div className="swiper-container iphone-slider">
							<div className="swiper-wrapper">
								<div className="swiper-slide"><LazyLoadImage className="img-fluid" src={setImagePath(PHONE_SLIDE1)} alt="" /></div>
								<div className="swiper-slide"><LazyLoadImage className="img-fluid" src={setImagePath(PHONE_SLIDE2)} alt="" /></div>
							</div>
							</div>
						</div>
						<div className="iphone-mockup" data-aos="zoom-out"><LazyLoadImage src={setImagePath(IPHONE_MOCKUP)} alt="" /></div>
						</div>
						<div className="bookingsSection-collage">
						<LazyLoadImage className="img-1 img-fluid" src={setImagePath(BOOKINGS_IMG1)} alt="" data-aos="zoom-out" />
						<LazyLoadImage className="img-2" src={setImagePath(BOOKINGS_IMG2)} alt="" data-aos="zoom-out" />
						<LazyLoadImage className="img-3" src={setImagePath(BOOKINGS_IMG3)} alt="" data-aos="zoom-out" />                  
						</div>
					</div>
					<div className="col-xl-5 col-lg-6 order-md-first" data-aos="fade-right" data-aos-delay="300">
						<div className="sec-heading d-none d-lg-flex">
						<LazyLoadImage src={setImagePath(BOOKINGS_ICN)} alt="" />
						<h3>Bookings</h3>
						</div>              
						<ul className="section-listings">
							<li><p>Manage all your bookings</p></li>
							<li><p>Stay organized and be on top of the things </p><small>(Follow-up tasks, reminders & notes)</small></li>
							<li><p>Customer location and directions on the go </p><small>(Integrated with Google maps)</small></li>
							<li><p>Automatic and manual booking creation </p><small>(After customer accepts a quote)</small></li>
							<li><p>Complete view of your business and pending tasks on dashboard</p></li>
						</ul>
						<a data-aos="fade-up-right" data-aos-offset="50"  href="#email" onClick={(e) => e.preventDefault()} className="link-primary ms-4">Learn more</a>
					</div>
					</div>
				</div>
				</div>
				<svg className="sec-svg-rotate sec-wave-svg" xmlns="http://www.w3.org/2000/svg" width="2500" height="40.213" viewBox="0 0 2500 40.213">
				<path id="Path_1" data-name="Path 1" d="M-1158,1385.178s328.969-43.928,657.879-13.867,406.3,24.41,701.79,0,293.732-12.11,629.677,0,475.537-3.891,510.612-4.509c.1.022,0-7.176,0-7.176v-8.047H-1158Z" transform="translate(1158 -1351.579)" fill="#eaf8f8"/>
				</svg>
			</section>
			</div>

			
			<section className="page-section" id="bizzHivePlans"  ref={planRef}>
				<div className="container">
				<div className="row">
					<div className="col-12">
					<div className="bizzHivePlans-table table-responsive">
						<table className="table">
						<thead>
							<tr>
							<th scope="col"></th>
							<th colSpan="3"><h3 className="bizzHivePlans-title" data-aos="zoom-out-up" data-aos-offset="100">PLANS</h3></th>
							</tr>
							<tr>
							<th scope="col" className=" plan-ftr-img pb-5"><LazyLoadImage data-aos="flip-left" data-aos-offset="150" className="img-fluid" src={setImagePath(TAXI_GROW)} alt="" /></th>
							<th scope="col">
								<div className="plan-card-wrap" data-aos="flip-left" data-aos-offset="150">
								<div className="plan-title">Silver</div>
								<div className="plan-wrap">
									<div className="plan-subtitle">Get Organized</div>
									<div className="plan-price">$00.00</div>
									<p>per month</p>
									<div className="plan-peryear">$000.00 (1 year)</div>
									<p>(save 30%)</p>
								</div>
								</div>
							</th>
							
							<th scope="col">
								<div className="plan-card-wrap" data-aos="flip-left" data-aos-offset="150">
								<div className="plan-title">Gold</div>
								<div className="plan-wrap">
									<div className="plan-subtitle">Look Professional</div>
									<div className="plan-price">$00.00</div>
									<p>per month</p>
									<div className="plan-peryear">$000.00 (1 year)</div>
									<p>(save 30%)</p>
								</div>
								</div>
							</th>
							
							<th scope="col">
								<div className="plan-card-wrap" data-aos="flip-left" data-aos-offset="150">
								<div className="plan-title">Platinum</div>
								<div className="plan-wrap">
									<div className="plan-subtitle">One-stop Shop</div>
									<div className="plan-price">$00.00</div>
									<p>per month</p>
									<div className="plan-peryear">$000.00 (1 year)</div>
									<p>(save 30%)</p>
								</div>
								</div>
							</th>
							</tr>
						</thead>

						<tbody>
							<tr>
							<th scope="row">Contacts <img data-tip="Store customer info and track activities" src={setImagePath(INFO_ICN)} alt="" /></th>
							<td><LazyLoadImage src={setImagePath(ORANGE_CHECK)} alt="" data-aos="flip-left" data-aos-offset="150" /></td>
							<td><LazyLoadImage src={setImagePath(ORANGE_CHECK)} alt="" data-aos="flip-left" data-aos-offset="150" /></td>
							<td><LazyLoadImage src={setImagePath(ORANGE_CHECK)} alt="" data-aos="flip-left" data-aos-offset="150" /></td>
							</tr>
							<tr>
							<th scope="row">Leads <img data-tip="Track your potential customers and customize workflows as needed" src={setImagePath(INFO_ICN)} alt="" /></th>
							<td><LazyLoadImage src={setImagePath(ORANGE_CHECK)} alt="" data-aos="flip-left" data-aos-offset="150" /></td>
							<td><LazyLoadImage src={setImagePath(ORANGE_CHECK)} alt="" data-aos="flip-left" data-aos-offset="150" /></td>
							<td><LazyLoadImage src={setImagePath(ORANGE_CHECK)} alt="" data-aos="flip-left" data-aos-offset="150" /></td>
							</tr>
							<tr>
							<th scope="row">Tasks/Notes <img data-tip="Keep track of action itemm/follow ups and key information" src={setImagePath(INFO_ICN)} alt="" /></th>
							<td><LazyLoadImage src={setImagePath(ORANGE_CHECK)} alt="" data-aos="flip-left" data-aos-offset="150" /></td>
							<td><LazyLoadImage src={setImagePath(ORANGE_CHECK)} alt="" data-aos="flip-left" data-aos-offset="150" /></td>
							<td><LazyLoadImage src={setImagePath(ORANGE_CHECK)} alt="" data-aos="flip-left" data-aos-offset="150" /></td>
							</tr>
							<tr>
							<th scope="row">Bookings <img data-tip="Complete view of past and upcoming bookings. Access info on the go." src={setImagePath(INFO_ICN)} alt="" /></th>
							<td><LazyLoadImage src={setImagePath(ORANGE_CHECK)} alt="" data-aos="flip-left" data-aos-offset="150" /></td>
							<td><LazyLoadImage src={setImagePath(ORANGE_CHECK)} alt="" data-aos="flip-left" data-aos-offset="150" /></td>
							<td><LazyLoadImage src={setImagePath(ORANGE_CHECK)} alt="" data-aos="flip-left" data-aos-offset="150" /></td>
							</tr>
							<tr>
							<th scope="row">Quotes <img data-tip="Create & send customized quotes & collect customer signatures electronically" src={setImagePath(INFO_ICN)} alt="" /></th>
							<td></td>
							<td><LazyLoadImage src={setImagePath(ORANGE_CHECK)} alt="" data-aos="flip-left" data-aos-offset="150" /></td>
							<td><LazyLoadImage src={setImagePath(ORANGE_CHECK)} alt="" data-aos="flip-left" data-aos-offset="150" /></td>
							</tr>
							<tr>
							<th scope="row">E- signatures from your customers {/* <img src={setImagePath(INFO_ICN)} alt="" /> */}</th>
							<td></td>
							<td><LazyLoadImage src={setImagePath(ORANGE_CHECK)} alt="" data-aos="flip-left" data-aos-offset="150" /></td>
							<td><LazyLoadImage src={setImagePath(ORANGE_CHECK)} alt="" data-aos="flip-left" data-aos-offset="150" /></td>
							</tr>
							<tr>
							<th scope="row">Deposits/Payments <img data-tip="Collect deposits/payments instantly and track invoices" src={setImagePath(INFO_ICN)} alt="" /></th>
							<td></td>
							<td></td>
							<td><LazyLoadImage src={setImagePath(ORANGE_CHECK)} alt="" data-aos="flip-left" data-aos-offset="150" /></td>
							</tr>
							<tr>
							<th scope="row">Invoices <img data-tip="Create & send customized invoices & collect payments electronically" src={setImagePath(INFO_ICN)} alt="" /></th>
							<td></td>
							<td></td>
							<td><LazyLoadImage src={setImagePath(ORANGE_CHECK)} alt="" data-aos="flip-left" data-aos-offset="150" /></td>
							</tr>
							{/* <tr>
							<th scope="row">Remove MyBizzHive branding</th>
							<td></td>
							<td></td>
							<td><LazyLoadImage src={setImagePath(ORANGE_CHECK)} alt="" data-aos="flip-left" data-aos-offset="150" /></td>
							</tr> */}
							<tr className="plan-buttons">
							<td></td>
							<td colSpan="2" align="center">
								<div data-aos="fade-up" data-aos-offset="150">
									<Link to={REGISTER} className="btn btn-primary me-lg-5 font-weight-bold">Start 3 Months FREE Trial</Link>
									<p className="mt-2 credit-notrequired">Credit card NOT required</p>
								</div>
							</td>
							<td valign="middle"><small>Upgrade/Purchase Required</small></td>
							</tr>
						</tbody>
						</table>
					</div>
					</div>
				</div>
				</div>
			</section>
			
			
			<section className="page-section" id="faqSection"  ref={faqRef}>
				<svg className="sec-svg-rotate sec-wave-svg" xmlns="http://www.w3.org/2000/svg" width="2500" height="36.518" viewBox="0 0 2500 36.518">
				<path id="Path_1" data-name="Path 1" d="M1342,1366.546s-271.774,39.418-600.684,9.357-410.687-13.516-693.49,2.079-341.026,15.6-655.02-12.477-515.69,10.444-550.764,11.062c-.1-.022,0,7.176,0,7.176v8.047H1342Z" transform="translate(1158 -1355.273)" fill="#eaf8f8"/>
				</svg>
				<div className="faqSection-wrap">
				<div className="container">
					<div className="row">
					<div className="col-12">
						<div className="sec-heading justify-content-center"><h3 className="ms-0">FAQs</h3></div>                
					</div>
					<div>
					</div>
					</div>
					<div className="row">
					<div className="col-auto faq-side-photos">
						<LazyLoadImage src={setImagePath(FAQ_IMG1)} alt="" data-aos="zoom-out-up" />
						<LazyLoadImage src={setImagePath(FAQ_IMG2)} alt="" data-aos="zoom-out-up" />
						<LazyLoadImage src={setImagePath(FAQ_IMG3)} alt="" data-aos="zoom-out-up" />
					</div>
					<div className="col">
						<div className="faq-accordion" id="accordionExample" data-aos="fade-left" data-aos-delay="300">
						<div className="faq-card">
							<h5 className="mb-0 faq-card-header">
							<a data-toggle="collapse" href="#collapse1" role="button" aria-expanded="true" aria-controls="collapse1">
								Who should use MyBizzHive?
							</a>
							</h5>
							<div id="collapse1" className="collapse show" data-parent="#accordionExample">
								<div className="faq-card-body">
									<p>This simple easy to use application is for small service-based businesses who have a typical lead to quote to cash journey. This includes seamlessly connecting with new prospects and delivering service to existing customers.</p>
									<p>To use this app, you don't need any prior training or setup. You can even match your business processes & terminology with the app within a few minutes. </p>
									<p>You can sign up for a free 3-month trial (no credit card required) and test drive the solution to see if it fits your business needs. No strings attached!</p>
									<ul className="faqinrpoints">
										<li>Entertainers</li>
										<li>DJs</li>
										<li>Bouncy House Rentals</li>
										<li>Carpet Cleaning</li>
										<li>Musicians & Bands</li>
										<li>Caterers</li>
										<li>Magicians</li>
										<li>Home Cleaning</li>
										<li>Photographers</li>
										<li>Equipment Rentals</li>
										<li>Face Painters</li>
										<li>Painters</li>
										<li>Decorators</li>
										<li>Bartenders</li>
										<li>Balloon Artists</li>
										<li>Handyman</li>
										<li>Wedding Services</li>
										<li>Videographers</li>
										<li>Petting Zoos</li>
										<li>Gardners</li>
										<li>Event Management</li>
										<li className="notext"></li>
										<li>Cartoon characters</li>
										<li>Real Estate Agents </li>
										<li>Freelancers</li>
										<li className="notext"></li>
										<li>Puppet shows</li>
										<li>Construction services </li>
									</ul>
								</div>
							</div>
						</div>
						<div className="faq-card">
							<h5 className="mb-0 faq-card-header">
							<a data-toggle="collapse" href="#collapse2" role="button" aria-expanded="false" aria-controls="collapse2">
								Do I need an app to access my account from a mobile device?
							</a>
							</h5>
							<div id="collapse2" className="collapse"  data-parent="#accordionExample">
							<div className="faq-card-body">
								<p>No, our application is optimized for all screen sizes and doesn't need a separate mobile app. Use any smartphone browser (Chrome, Safari, etc.) and login to access your account. The information is saved and synced automatically on all devices you use. </p>
							</div>
							</div>
						</div>
						<div className="faq-card">
							<h5 className="mb-0 faq-card-header">
							<a data-toggle="collapse" href="#collapse3" role="button" aria-expanded="false" aria-controls="collapse3">
								Is my data secure?
							</a>
							</h5>
							<div id="collapse3" className="collapse" data-parent="#accordionExample">
							<div className="faq-card-body">
								<p>Yes, this was our top priority while building the system. We have made all necessary security investments to make sure your information is safe and protected from unauthorized access at all times.</p>
							</div>
							</div>
						</div>
						<div className="faq-card">
							<h5 className="mb-0 faq-card-header">
							<a data-toggle="collapse" href="#collapse4" role="button" aria-expanded="false" aria-controls="collapse4">
								Do you sell my information to any third parties?
							</a>
							</h5>
							<div id="collapse4" className="collapse" data-parent="#accordionExample">
							<div className="faq-card-body">
								<p>No, we do not share your customer or business data with any third-parties or contact them for any reason.</p>
							</div>
							</div>
						</div>
						<div className="faq-card">
							<h5 className="mb-0 faq-card-header">
							<a data-toggle="collapse" href="#collapse5" role="button" aria-expanded="false" aria-controls="collapse5">
								How do I collect payments from my customers?
							</a>
							</h5>
							<div id="collapse5" className="collapse" data-parent="#accordionExample">
							<div className="faq-card-body">
								<p>Your customers can pay using any credit card or PayPal. We will send the payments to your PayPal at no extra cost or commissions. We only facilitate the process and never store your customer payment info. Do a one-time setup in your MyBizzHive account and start collecting payments for no additional processing fees. </p>
							</div>
							</div>
						</div>
						<div className="faq-card">
							<h5 className="mb-0 faq-card-header">
							<a data-toggle="collapse" href="#collapse6" role="button" aria-expanded="false" aria-controls="collapse6">
								Do I have to pay any payment processing fees?
							</a>
							</h5>
							<div id="collapse6" className="collapse" data-parent="#accordionExample">
							<div className="faq-card-body">
								<p>No, as long as you are on the plan that allows accepting payments, there are no additional fees.</p>
							</div>
							</div>
						</div>
						<div className="faq-card">
							<h5 className="mb-0 faq-card-header">
							<a data-toggle="collapse" href="#collapse10" role="button" aria-expanded="false" aria-controls="collapse10">
								How does the FREE trial work?
							</a>
							</h5>
							<div id="collapse10" className="collapse" data-parent="#accordionExample">
							<div className="faq-card-body">
								<p>You can use our <strong>Gold plan</strong> during your <strong>FREE</strong> trial. The Gold plan allows you to manage contacts, leads, bookings, quotations, and collect electronic signatures from your customers. Feel free to <strong>upgrade to the Platinum</strong> plan if you want to accept payments/deposits as well.</p>
								<p><strong>Note:</strong> If you have purchased a plan during the free trial, then your subscription term will only start at the end of your free trial period. So you don’t lose the free trial benefits. We are transparent like that.</p>
							</div>
							</div>
						</div>
						<div className="faq-card">
							<h5 className="mb-0 faq-card-header">
							<a data-toggle="collapse" href="#collapse8" role="button" aria-expanded="false" aria-controls="collapse8">
								What happens when the FREE trial ends?
							</a>
							</h5>
							<div id="collapse8" className="collapse" data-parent="#accordionExample">
							<div className="faq-card-body">
								<p>You will still have access to your account and any information you have created even after the FREE trial ends. However, once the free trial ends, you will not be able to edit or add any information. </p>
							</div>
							</div>
						</div>
						<div className="faq-card">
							<h5 className="mb-0 faq-card-header">
							<a data-toggle="collapse" href="#collapse9" role="button" aria-expanded="false" aria-controls="collapse9">
								How does cancellation work?
							</a>
							</h5>
							<div id="collapse9" className="collapse" data-parent="#accordionExample">
							<div className="faq-card-body">
								<p>You can stop paying at the end of your subscription and still access to your account and data. If you want to cancel during your subscription, send us an email at <a href="mailto:cancellation@mybizzhive.com">cancellation@mybizzhive.com</a> and we will process the refund. </p>
								<p>We won’t be offering any partial refunds for monthly subscriptions. However, for yearly subscriptions, the refund amount will be calculated as follows: </p>
								<p><strong>Total Amount paid for a yearly subscription - [ Number of months you have used the app for * regular month to month subscription charges of the plan you picked]</strong></p>
							</div>
							</div>
						</div>
						
						<div className="faq-card">
							<h5 className="mb-0 faq-card-header">
							<a data-toggle="collapse" href="#collapse11" role="button" aria-expanded="false" aria-controls="collapse11">
								Are there any hidden charges?
							</a>
							</h5>
							<div id="collapse11" className="collapse" data-parent="#accordionExample">
							<div className="faq-card-body">
								<p>None. What you see is what you pay.</p>
							</div>
							</div>
						</div>
						<div className="faq-card">
							<h5 className="mb-0 faq-card-header">
							<a data-toggle="collapse" href="#collapse12" role="button" aria-expanded="false" aria-controls="collapse12">
								Have more questions?
							</a>
							</h5>
							<div id="collapse12" className="collapse" data-parent="#accordionExample">
							<div className="faq-card-body">
								<p>Please fill out the contact form below or send an email to <a href="mailto:contact@mybizzhive.com">contact@mybizzhive.com</a> if you have any questions or need more information.</p>
							</div>
							</div>
						</div>
						</div>
					</div>
					</div>
				</div>
				</div>
				<svg className="sec-svg-rotate sec-wave-svg" xmlns="http://www.w3.org/2000/svg" width="2500" height="40.213" viewBox="0 0 2500 40.213">
				<path id="Path_1" data-name="Path 1" d="M-1158,1385.178s328.969-43.928,657.879-13.867,406.3,24.41,701.79,0,293.732-12.11,629.677,0,475.537-3.891,510.612-4.509c.1.022,0-7.176,0-7.176v-8.047H-1158Z" transform="translate(1158 -1351.579)" fill="#eaf8f8"/>
				</svg>
			</section>
			
			
			<section className="page-section" id="footerContact"  ref={contactRef}>
				<svg version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 2560 156" style={{"enableBackground":"new 0 0 2560 156"}} xmlSpace="preserve">
				<path fill="#ffffff" d="M2560,17.9c-155.7-0.2-288.9,15.9-390.1,45.5c-142.8,41.7-271,92.6-446.1,92.6c-240,0-283.7-39-522.3-99.9
				S553.5,9.8,415.2,14.6S-0.4,37.5-0.4,37.5L0.2,0h2559.9L2560,17.9z"/>
			</svg>
				<div className="footerContact-wrap">          
				<div className="container">
					<div className="row">
					<div className="col-12">
						<div className="sec-heading justify-content-center">
						<LazyLoadImage src={setImagePath(CONTACT_ICN)} alt="" />
						<h3 data-aos="zoom-out-up" data-aos-offset="100">CONTACT US</h3>
						</div> 
					</div>
					</div>
					<div className="row justify-content-center">
					<div className="col-xl-10 col-lg-11" data-aos="fade-up" data-aos-delay="300">
						
						<form className="row g-3">
						<div className="col-md-4 form-group">
							<label htmlFor="" className={"form-label "+ state.firstNameCls}>First Name *</label>
							<input type="text" className="form-control form-control-lg" name="firstName" value={state.firstName} onChange={(e) => setInputValue(e, 'string', 50, null)}/>
							{state.firstNameErr ? <div className="errorValidationMessage"> {state.firstNameErr}</div> : ''}
						</div>
						<div className="col-md-4 form-group">
							<label htmlFor="" className={"form-label "+ state.lastNameCls}>Last Name *</label>
							<input type="text" className="form-control form-control-lg" name="lastName" value={state.lastName} onChange={(e) => setInputValue(e, 'string', 50, null)} />
							{state.lastNameErr ? <div className="errorValidationMessage"> {state.lastNameErr}</div> : ''}
						</div>
						<div className="col-md-4 form-group">
							<label htmlFor="" className={"form-label "+ state.emailCls}>Email Address *</label>
							<input type="text" className="form-control form-control-lg" name="email" placeholder="example@example.com" value={state.email} onChange={(e) => setInputValue(e, 'email', null, null)} />
							{state.emailErr ? <div className="errorValidationMessage"> {state.emailErr}</div> : ''}
						</div>
						<div className="col-md-6 form-group">
							<label htmlFor="" className={"form-label "+ state.phoneCls}>Phone Number</label>
							<input type="text" className="form-control form-control-lg" placeholder="(555) 555-1234" name="phone" value={state.phone} onChange={(e) => setState({...state, phone: e.target.value, phoneCls: '', phoneErr: ''})}/>
							{state.phoneErr ? <div className="errorValidationMessage"> {state.phoneErr}</div> : ''}
						</div>
						<div className="col-md-6 form-group">
							<label htmlFor="inputState" className="form-label ">Reason</label>
							<Select
							styles={selectStyle}
							className="floating-select"
							options={state.reasonOptions}
							isSearchable={false}
							value={state.reason}
							placeholder="Select Reason"
							onChange={(data) => setState({...state, reason: data })}
							/>
						</div>
						<div className="col-12 form-group">
							<label htmlFor="exampleFormControlTextarea1" className="form-label ">Additional Information</label>
							<textarea className="form-control form-control-lg" id="exampleFormControlTextarea1" rows="3" placeholder="Tell us about your query and how we might be able to help!" name="additionalInformation" value={state.additionalInformation} onChange={(e) => setState({...state, additionalInformation: e.target.value, additionalInformationCls: '', additionalInformationErr: '' })}></textarea>
						</div>
						<div className="col-12 form-group">
							{loader ? 
							<button className="btn btn-dark" type="button" disabled>
								<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
								 Loading...
							</button>
							:
							<button type="submit" className="btn btn-dark" onClick={(e) => submitContactUsForm(e)}>SUBMIT</button>
							}
							</div>
						</form>
						
					</div>
					</div>
				</div>
				</div>
			</section>
			<Footer scrollTo={(data) => scrollTo(data)} />
			<ReactTooltip place="bottom" className="bizzHive-tooltip" multiline={true} />
			</main>
		</div>
	);
};
