import React from "react";
import SelectGroup from "../components/inputs/selectGroup";
import InputGroup from "../components/inputs/inputGroup";
import HDiv from "../components/containers/hdiv";
import VDiv from "../components/containers/vdiv";
import Fieldset from "../components/general/fieldset";
import useStorePurchaseOrderBrowser from "../hooks/useStorePurchaseOrderBrowser";
import { connect } from "react-redux";
import { Table } from "react-bootstrap";
import Button from "../components/inputs/button";
import CheckGroup from "../components/inputs/check-group";
import { poSearch } from "../service/masterServices-storePurchaseOrderBrowser";
import { useNavigate } from "react-router";
import { useStorePurchaseOrder } from "../hooks/useStorePurchaseOrder";
import {useHistory} from 'react-router-dom'
const StorePurchaseOrderBrowser = ({ hospitalId, subCenterId, locationId }) => {
  const {
    GetVendorName,
    vendorName,
    poStatus,
    processingStatus,
    handleFormChange,
    handleDateChange,
    currentDate,
    formValues,
    PoSearch,
    searchData,
    view,
    setView,
    masterDetails,
    setMasterDetails,
    viewPageDetails,
    setViewPageDetails,
    GetSearchDetailsData,
    specificationPageView,
    setSpecificationPageView,
    UpdateSpecification,
    FindPoDetailsById
  } = useStorePurchaseOrderBrowser(hospitalId, subCenterId);

  
const navigate = useNavigate();

  return (
    <VDiv className="grid">
      <Fieldset legend="PO Browse">
        <HDiv className="flex-wrap">
          <InputGroup
            label="PO No"
            name="itemDescription"
            type="text"
            className="form-group position-relative"
            onChange={(e) => handleFormChange(e)}
          />
          <SelectGroup
            className="form-group position-relative"
            label="Vendor"
            name="vendor"
            onChange={(e) => {
              GetVendorName(e);
              handleFormChange(e);
            }}
            option={vendorName ?? ""}
          />

          <InputGroup
            label="Item Code"
            name="itemCode"
            type="text"
            onChange={(e) => handleFormChange(e)}
            className="form-group position-relative"
          />

          <InputGroup
            label="Item Description"
            name="item-description"
            onChange={(e) => handleFormChange(e)}
            type="text"
            className="form-group position-relative"
          />

          <InputGroup
            label="Store"
            name="store"
            type="text"
            value={locationId.name}
            className="form-group position-relative"
          />
        </HDiv>
        <HDiv className="flex-wrap mt-2 ">
          <InputGroup
            label="From"
            name="from_date"
            type="date"
            className="form-group position-relative"
            defaultValue={new Date()}
            onChange={(e) => {
              handleDateChange(e);
              handleFormChange(e);
            }}
            value={currentDate}
          />

          <InputGroup
            label="To"
            name="to_date"
            type="date"
            onChange={(e) => handleFormChange(e)}
            className="form-group position-relative"
          />

          <SelectGroup
            label="PO status"
            name="po-status"
            option={poStatus}
            className="form-group position-relative"
          />

          <SelectGroup
            label="Processing status"
            name="processing-status"
            option={processingStatus}
            type="text"
            className="form-group position-relative"
          />
        </HDiv>

        <div className="d-flex justify-content-end gap-2">
          <Button
            className="btn btn-dark text-white"
            label="Search"
            onClick={PoSearch}
          />
          <Button className="btn btn-danger text-white" label="Cancel" />
        </div>
      </Fieldset>
      <div>
        <img src="/assets/images/eye-icon.svg" alt=""  onClick={()=>{}}/>
      </div>
      <Fieldset legend="PO Details">
        {/* <HDiv> */}
        {!view && !specificationPageView &&(
          <Table
            responsive
            className="table  table-bordered table-striped table-responsive text-wrap mb-5 "
            id="storetabledata"
          >
            <thead className="table-secondary">
              <tr>
                <th>PO No</th>
                <th>Cr.Date</th>
                <th>Store </th>
                <th>Vendor Name</th>
                <th>Prepared By</th>
                <th>Approved By</th>
                <th>Approved Date</th>
                <th>Cr.Status</th>
                <th>Delivery Status</th>
                <th>Remarks</th>
                <th>Edit/Approve</th>
                <th>View</th>
                <th>Specification</th>
                <th>PDF</th>
                <th>Excel</th>
              </tr>
            </thead>

            <tbody>
              {searchData?.map((item) => {
                return (
                  <tr>
                    <td className="w240">{item.poNumber}</td>
                    <td>{item.enteredDate}</td>
                    <td>{item.storeName}</td>
                    <td>{item.vendorName}</td>
                    <td className="w180">{item.enteredBy}</td>
                    <td></td>
                    <td></td>
                    <td>{item.poCreationStatus === "O"? "Open" : "Approved"}</td>
                    <td>{item.poDeliveryStatus === "O" ? "Open" : "Approved" }</td>
                    <td>{item.remarks}</td>
                    <td className="text-center">
                      <img src="/assets/images/editsymb.svg" alt="edit"  onClick={()=>{
                        navigate('/store-purchase-order')
                        FindPoDetailsById(item.id)
                    }}/>
                    </td>
                    <td className="text-center">
                      <img
                        src="/assets/images/icons/Vector.svg"
                        alt="view"
                        onClick={() => {
                          setView(!view);
                          GetSearchDetailsData(item.id);
                          setMasterDetails(false);
                        }}
                      />
                    </td>
                    <td className="text-center">
                      <img src="/assets/images/specification.svg" alt="spec" onClick={()=>{
                        setSpecificationPageView(true);
                        GetSearchDetailsData(item.id);
                        setMasterDetails(false);
                      }} />
                    </td>
                    <td className="text-center d-none">
                      <img src="/assets/images/pdf.svg" alt="pdf" />
                    </td>
                    <td className="text-center d-none">
                      <img src="/assets/images/excel.svg" alt="excel" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}

        {view && (
          <>
          <Table
            responsive
            className="table table-bordered table-striped table-responsive text-wrap mb-5 "
            id="storetabledata"
          >
            <thead className="table-secondary">
              <tr>
              
                <th>PRQ No</th>
                <th>Item code</th>
                <th>Description </th>
                <th>Item Specification</th>
                <th>UOM</th>
                <th>Unit Rate</th>
                <th>Request Qty</th>
                <th>Order Qty</th>
                <th>Total Price</th>
                <th>Pending Qty</th>
                <th>Dis.Value</th>
                <th>Cess %</th>
                <th>Vat %</th>
                <th>Grand Total</th>
                <th>MRP Quoted</th>
                <th>Remark</th>
              </tr>
            </thead>
            <tbody>
              {viewPageDetails?.map((item) => {
                return (
                  <tr>
                   
                    <td className="w180">{item.prqNumber}</td>
                    <td>{item.itemCode}</td>
                    <td>{item.itemName}</td>
                    <td>{item.specification}</td>
                    <td>{item.uomName}</td>
                    <td>{item.unitRate}</td>
                    <td>{item.requiredQuantity}</td>
                    <td>
                      <InputGroup className="w130" value={item.recievedQuantity}/>
                    </td>
                    <td>{item.totPrice}</td>
                    <td>0</td>
                    <td className="text-center">{item.discountValue}</td>
                    <td className="text-center">0</td>
                    <td className="text-center">12%</td>
                    <td className="text-center">{item.grantTotal}</td>
                    <td className="text-center">0</td>
                    <td></td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

</>
        )}
   
   

   
 { view &&<div >
<div className="d-flex gap-2 align-item-center">
<p>Total Item  </p>
  <InputGroup className="w50" value={viewPageDetails?.length}/>
 
  </div>

  <div className="d-flex flex-column justify-content-center align-items-center">
    <p>Total vat:</p>
    <p>Total cess:</p>
    <p>Total Discount:</p>
    <p>Total Amount:</p>
    <p>Final Discount:</p>
    <p>..............................................</p>
    <p>Grant Total</p>        
  </div>
</div>}

{specificationPageView && (
          <Table
            responsive
            className="table table-bordered table-striped table-responsive text-wrap mb-5 "
            id="storetabledata"
          >
            <thead className="table-secondary">
              <tr>
              
                <th>PRQ No</th>
                <th>Item code</th>
                <th>Description </th>
                <th>Specification</th>
                <th>Save</th>
              </tr>
            </thead>
            <tbody>
              {viewPageDetails?.map((item) => {
                console.log(item.id,"ghj",item.prqNumber);
                
                return (
                  <tr>
                   
                    <td className="w180">{item.prqNumber}</td>
                    <td>{item.itemCode}</td>
                    <td>{item.itemName}</td>
                    <td className="w500"><InputGroup defaultValue={formValues.details_specification} className="w240" onChange={(e) => handleFormChange(e)}  name="details_specification"/></td>
                    <td className="w70"><Button className="btn btn-dark bg-green" label="Save" onClick={(e)=>UpdateSpecification(e,item.id)}/></td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}

        {/* </HDiv> */}
      </Fieldset>
    </VDiv>
  );
};

const mapStateToProps = (state) => {
  return {
    hospitalId: state.utillReducer.hospitalId,
    subCenterId: state.utillReducer.subCenterId,
    locationId: state.utillReducer.locationId,
  };
};

export default connect(mapStateToProps, {})(StorePurchaseOrderBrowser);
