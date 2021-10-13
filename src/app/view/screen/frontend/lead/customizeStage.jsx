import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Header } from '../../../component/frontend/header/header'
import { Footer } from '../../../component/frontend/footer/footer'
import { setImagePath, usePrevious } from '../../../../common/custom'
import { Link, withRouter } from "react-router-dom";
import { LIST_LEADS } from "../../../../routing/routeContants";
import ARROW_RIGHT from '../../../../assets/images/arrow-rgt-teal.svg'
import ORANGE_ARROW from '../../../../assets/images/orange-arrow.svg'
import CIRCLE_ICON from '../../../../assets/images/add-circle-icn.svg'
import { listLeadStatus, customizeLeadStage } from '../../../../duck/lead/lead.action';
import _ from 'lodash';
import ERROR_ICON from '../../../../assets/images/error-icn.svg'
import Swal from 'sweetalert2'
import { errorPopUp } from '../../../../common/notification-alert';

export const CustomizeStagePage = props => {

	const dispatch = useDispatch();
	const [loader, setLoader] = useState(false);
	const [lastArr, setLastArr] = useState([])
    const [leadStagesData, setleadStagesData] = useState([]);
    const [serviceMessage, setServiceMessage] = useState('');
	const listLeadStatusData = useSelector(state => state.lead.listLeadStatusData);
    const prevListLeadStatusData = usePrevious({ listLeadStatusData });
	const customizeLeadStageData = useSelector(state => state.lead.customizeLeadStageData);
    const prevCustomizeLeadStageData = usePrevious({ customizeLeadStageData });

    // On Load Get Data
      useEffect(() => {
        setLoader(true)
        dispatch(listLeadStatus())
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

	 // List Lead Status Data And Get Lead Data
	 useEffect(() => {
        if (prevListLeadStatusData && prevListLeadStatusData.listLeadStatusData !== listLeadStatusData) {
            if (listLeadStatusData && _.has(listLeadStatusData, 'data') && listLeadStatusData.success === true) {
				setLoader(false)
				let allStagesData = [];
				_.map(listLeadStatusData.data, (val, ind) => {
					let data = {id:val.id, name:val.name, count: val.leads_count }
					allStagesData.push(data)
				})
				setLastArr(_.last(listLeadStatusData.data))
				setleadStagesData(allStagesData)
            }
            if (listLeadStatusData && _.has(listLeadStatusData, 'message') && listLeadStatusData.success === false) {
				setLoader(false)
				errorPopUp(listLeadStatusData.message)
            }
        }
        if (prevCustomizeLeadStageData && prevCustomizeLeadStageData.customizeLeadStageData !== customizeLeadStageData) {
            if (customizeLeadStageData && _.has(customizeLeadStageData, 'data') && customizeLeadStageData.success === true) {
				setLoader(false)
				props.history.push(LIST_LEADS)
            }
            if (customizeLeadStageData && _.has(customizeLeadStageData, 'message') && customizeLeadStageData.success === false) {
				setLoader(false)
				errorPopUp(customizeLeadStageData.message)
            }
        }
    }, [listLeadStatusData, prevListLeadStatusData, prevCustomizeLeadStageData, customizeLeadStageData]);// eslint-disable-line react-hooks/exhaustive-deps

	// handle input change
	const handleInputChange = (e, index) => {
		const { name, value } = e.target;
		const list = [...leadStagesData];
		list[index][name] = value;
		setServiceMessage();
		setleadStagesData(list);
	};

	// handle click event of the Remove button
	const handleRemoveClick = (e, index) => {
		e.preventDefault();
		Swal.fire({
            title: 'Are you sure?',
            text: 'If you delete a stage, the leads in that stage will be assigned to the previous/next stage. Are you sure you want to delete the stage?',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'No, keep it',
            reverseButtons: true,
            showCloseButton: true,
            customClass: "mycustom-alert",
            cancelButtonClass: 'cancel-alert-note',
        }).then((result) => {
            if (result.value) {
				const list = [...leadStagesData];
				if(index===0){
					list[1].count = list[1].count + list[0].count
				}else{
					list[index-1].count = list[index-1].count + list[index].count
				}
				list.splice(index, 1);
				setleadStagesData(list);
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // console.log('cancel')
            }
        })
	};

	// handle click event of the Add button
	const handleAddClick = (e) => {
		e.preventDefault();
		const lastKey = _.last(leadStagesData)
		leadStagesData.splice(-1,1)
		setleadStagesData([...leadStagesData, { name: "", id:"", count: 0 }, lastKey]);
		document.getElementById('scrollToComplete').scrollIntoView()
	};

	const moveItem = (e, from, to) => {
		e.preventDefault();
		let data = leadStagesData;
		// remove `from` item and store it
		var f = data.splice(from, 1)[0];
		// insert stored item into position `to`
		data.splice(to, 0, f);
		setleadStagesData(JSON.parse(JSON.stringify(data)))
	}

	const saveCustomizeStage = (e) => {
		e.preventDefault();
		let allLeadStatusData = [];
		_.map(leadStagesData, (val,lkey) => {
			val.position = lkey+1;
			allLeadStatusData.push(val)
		})
		const ckeckValue =_.filter(leadStagesData, (data) => _.isEmpty(data.name));
		const checkcompleted =_.filter(leadStagesData, (data) => ((data.name).trim()).toLowerCase()==='won/lost');
		if (ckeckValue.length > 0) {
			errorPopUp("Please fill all the input value.")
		}else if(checkcompleted.length>1){
			errorPopUp("Won/Lost duplicate stage value exist.")
		}else if(allLeadStatusData.length<2){
			errorPopUp("Minimum 2 lead stage is required.")
		}else {
			setLoader(true)
			dispatch(customizeLeadStage({stages:allLeadStatusData}))
		}
	}   

    return (
        <div className="main-site fixed--header">
			<Header loader={loader} getMainRoute={'leads'}/>
            <main className="site-body">
      
      	<section className="page-title contact--header">
        <div className="container">
          <div className="row">
            <div className="col-lg-auto title--col">
              <div>
                <ol className="breadcrumb d-none d-lg-flex">
                  <li className="breadcrumb-item"><Link to={LIST_LEADS}>Leads</Link></li>
                  <li className="breadcrumb-item active" aria-current="page">Customize Stages</li>
                </ol>
                <h2 className="title"><span className="d-none d-lg-flex">Customize Stages</span> <span className="d-lg-none">Customize Lead Stage</span></h2>
              </div>
            </div>
            <div className="col-auto ml-auto d-flex align-items-center title-elems">
              <Link to={LIST_LEADS} className="btn d-none d-lg-flex btn-dark mr-15">Cancel</Link>
              <a href="#lead" onClick={(e) => saveCustomizeStage(e)} className="btn d-none d-lg-flex btn-primary">Apply Changes</a>
              <Link to={LIST_LEADS} className="btn d-lg-none btn-dark mr-15">Cancel</Link>
              <a href="#lead" onClick={(e) => saveCustomizeStage(e)} className="btn d-lg-none btn-primary">Apply Changes</a>
            </div>
          </div>
        </div>
      </section>
      
      <section className="middle-section">
        <div className="container">
		{serviceMessage ? <div className="errorCls errCommonCls"><img src={setImagePath(ERROR_ICON)} alt="" />{serviceMessage}</div> : ''}
          <div className="row no-gutters-mbl">
            <div className="col-12">
              <div className="customize-stages-info d-lg-none">
                <strong>Note:</strong> If you delete a stage, the leads in that stage will be assigned to the previous/next stage. 
              </div>
              <div className="main-card d-none d-lg-flex">
                <div className="card w-100">
                  <div className="card-header d-none d-lg-flex d- py-4 justify-content-between align-items-center">
                    <h2>Preview</h2>
                  </div>
                  <div className="card-body pt-0">
                    <div className="leads-container stage--preview-container">
                      <div className="leads-container_row leads-container_scroller">
					  {_.map(leadStagesData, (data, key) => {
                        return <div className="leads-col" key={key}>
                          <div className="leads-col_header">
                            <button className="btn btn-block d-lg-none btn--card-collapse" type="button" data-toggle="collapse" data-target="#LeadsCollapse1" aria-expanded="false" aria-controls="LeadsCollapse1"><div><span>1-</span>{data.name}</div> <img src={setImagePath(ORANGE_ARROW)} alt="" /></button>
                            <div className="header--web d-none d-lg-flex"><h4>{data.name}</h4><img src={setImagePath(ARROW_RIGHT)} alt="" /></div>
                          </div>
                        </div>
					  })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>              
            </div>
          </div>
          
          <div className="row no-gutters-mbl mt-lg-4">
            <div className="col-12">
              <div className="main-card">
                <div className="card">
                  <div className="card-header py-4 d-flex justify-content-between align-items-center">
                    <h2>Manage Stages</h2>
                    <div className="card-header_btns d-none d-lg-flex justify-content-end align-items-center">
                      <a href="#lead" onClick={(e) => handleAddClick(e)} className="btn btn-secondary">Add New Stage</a> 
                    </div>
                    <div className="d-lg-none w-100 text-center ">
                      <a href="#lead" onClick={(e) => handleAddClick(e)} className="btn text-link"><img src={setImagePath(CIRCLE_ICON)} alt="" /> Add New Stage</a>
                    </div>
                  </div>
                  <div className="card-body pt-1">
                    
                    <div className="table-responsive">
                      <table className="table table-striped stages--table customize-stage-table">
                        <thead>
                          <tr>
                            <th scope="col">Move Up/Down</th>
                            <th scope="col">Stage Name</th>
                            <th scope="col">No. of Leads</th>
                            <th scope="col">Delete</th>
                            <th scope="col"></th>
                          </tr>
                        </thead>
                        <tbody>
                           {_.map(leadStagesData, (data, key) => {
								return <tr key={key}> 
									<td className="move--updown">
									{lastArr.id===data.id ?
										<div></div>
										:
										<div className="moveupdown">
											<a href="#lead" onClick={(e) => (key===0 ?  e.preventDefault() : moveItem(e, key, key-1))} className={key===0 ? "btn btn--up" : "btn btn--up active"}>
											<svg width="20px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
												viewBox="0 0 20 20" style={{"enableBackground":"new 0 0 20 20"}} xmlSpace="preserve">
												<mask maskUnits="userSpaceOnUse" id="mask1_1_">
													<rect x="-21.3" y="-21.3" className="st0" width="62.5" height="62.5"/>
												</mask>
												<path className="st2" d="M0,10l1.8,1.8l7-7V20h2.5V4.8l7,7L20,10L10,0L0,10z"/>
											</svg>
											</a>
											<a href="#lead" onClick={(e) => ((((leadStagesData.length)-2)===key) ?  e.preventDefault() : moveItem(e, key, key+1))} className={ ((leadStagesData.length)-2)===key ? "btn btn--down" : "btn btn--down active"}>
											<svg width="20px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
												viewBox="0 0 20 20" style={{"enableBackground":"new 0 0 20 20"}} xmlSpace="preserve">
												<mask maskUnits="userSpaceOnUse" id="mask1_1_">
													<rect x="-21.3" y="-21.3" className="st0" width="62.5" height="62.5"/>
												</mask>
												<path className="st2" d="M10,20l10-10l-1.8-1.8l-7,7V0H8.8v15.2l-7-7L0,10L10,20z"/>
											</svg>
											</a>
										</div>
									}
									</td>
									<td className="stage--name"><input type="text"  onChange={e => handleInputChange(e, key)} name="name" placeholder="name" value={data.name} disabled={lastArr.id===data.id ? true : false} className="form-control mr-15" /></td>
									<td className="no--leads text-center">{data.count}</td>
									<td className="delete--stage text-center">
										{lastArr.id===data.id ?
											<div className="deletestage" id="scrollToComplete">
												N/A
											</div>
											:
											<div className="deletestage">
												<a href="#deleteStageaaa" data-toggle="tooltip" data-placement="top" title="Delete" onClick={(e) => handleRemoveClick(e, key)} className="close-icn">
													<svg width="20px" height="20px" fill="var(--danger)" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
														viewBox="0 0 174.239 174.239" style={{"enableBackground":"new 0 0 174.239 174.239"}} xmlSpace="preserve">
													<g>
														<path d="M87.12,0C39.082,0,0,39.082,0,87.12s39.082,87.12,87.12,87.12s87.12-39.082,87.12-87.12S135.157,0,87.12,0z M87.12,159.305
															c-39.802,0-72.185-32.383-72.185-72.185S47.318,14.935,87.12,14.935s72.185,32.383,72.185,72.185S126.921,159.305,87.12,159.305z"
															/>
														<path d="M120.83,53.414c-2.917-2.917-7.647-2.917-10.559,0L87.12,76.568L63.969,53.414c-2.917-2.917-7.642-2.917-10.559,0
															s-2.917,7.642,0,10.559l23.151,23.153L53.409,110.28c-2.917,2.917-2.917,7.642,0,10.559c1.458,1.458,3.369,2.188,5.28,2.188
															c1.911,0,3.824-0.729,5.28-2.188L87.12,97.686l23.151,23.153c1.458,1.458,3.369,2.188,5.28,2.188c1.911,0,3.821-0.729,5.28-2.188
															c2.917-2.917,2.917-7.642,0-10.559L97.679,87.127l23.151-23.153C123.747,61.057,123.747,56.331,120.83,53.414z"/>
													</g>
													</svg>
												</a>
											</div>
											}
									</td>
									{key===0 ?
										<td className="stage--notes"><strong>Note:</strong> If you delete a stage, the leads in that stage will be assigned to the previous/next stage. </td>
									: <td></td>}
								</tr>
						   })}                          
                        </tbody>
                      </table>
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </section>
      
    </main>
    
            <Footer />
        </div >
    );
}

export const CustomizeStage = withRouter(CustomizeStagePage)