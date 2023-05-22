import React from "react";
import VDiv from "../components/containers/vdiv";
import Fieldset from "../components/general/fieldset";
import SelectGroup from "../components/inputs/selectGroup";
import InputGroup from "../components/inputs/inputGroup";
import HDiv from "../components/containers/hdiv";
import Button from "../components/inputs/button";
import { Col, Modal, Row, Table } from "react-bootstrap";
import { useStorePurchaseOrder } from "../hooks/useStorePurchaseOrder";
import { connect } from "react-redux";
import { useAlert } from "react-alert";


const StorePurchaseOrder = ({ hospitalId, subCenterId, locationId }) => {
  const {
    setOpenPRQDetails,
    GetVendorName,
    vendorName,
    status,
    type,
    deliveryType,
    handleFormChange,
    SearchPRQData,
    PRQBrowserData,
    GetPRQDetails,
    PRQDetails,
    storePRQNo,
    GetVendorList,
    vendorList,
    modalShow,
    handleClose,
    setModalShow,
    noRecords,
    freeModal,
    handleFreeModal,
    GetFreeItemsByItemName,
    listFreeItems,
    setListFreeItems,
    prqAddedItems,
    handleDelete,
    setFreeModal,
    formValues,
    setFormValues,
    showConfirmationPopup,
    setShowConfirmationPopup,
    setActiveInput,
    addSelectedPrqDetailsOnCancelClick,
    handleInputChange,
    activeAdd,
    setActiveAdd,
    setPRQAddedItems,
    setTotal,
    totalPrice,
    handleCalculations,
    totalSum,
    discountedTotal,
    calculateGrandTotal,
    gstAmount,
    store,
    ListStores,
    serverDate,
    handleDateChange,
    selectedDate,
    setSelectedDate,
    preventItemDuplicates,
    selectedVendor,
    setSelectedVendor,
    calculateTotalWithAdditionalCost,
    calculateTotalWithExchangeCost,
    discountAmtTotal,
    discountPercentageTotal,
    SavePurchaseOrder,
    handleReload,
    GetFreeItemsByItemCode,
    handleFreeItemCalculation,
    freeItemsAdd
  } = useStorePurchaseOrder(hospitalId, subCenterId, locationId);

  const itemTypeId = localStorage.getItem("itemTypeId");
  const alert = useAlert();

  
  // Disable the dropdown if a vendor is selected
  const dropdownDisabled = selectedVendor !== null;

  const showVendorAlert = () => {
    if (selectedVendor == null) {
      alert.show("Select vendor");
    }
  };

  
  return (
    <VDiv className="position-relative">
      <Col>
        <Col className="col-xl-6 col-12 w-100">
          <Fieldset legend="Purchase Order">
            <HDiv className="flex-wrap">
              <SelectGroup
                className="form-group position-relative "
                label="Vendor"
                onChange={(event) => {
                  GetVendorName();
                  handleFormChange(event);
                  setSelectedVendor(event.target.value);
                }}
                option={vendorName}
                name="vendor"
                enabled={dropdownDisabled}
              />

              <SelectGroup
                option={status}
                name="po_status"
                className="form-group position-relative "
                label="PO status"
              />

              <SelectGroup
                className="form-group position-relative "
                label="Store"
                onChange={() => {
                  ListStores();
                }}
                option={store ?? ""}
              />

              <SelectGroup
                className="form-group position-relative "
                option={type}
                label="PO Type"
                name="po_type"
              />

              <InputGroup
                label="PO Date"
                className="form-group position-relative "
                type="date"
                value={serverDate.toISOString().slice(0, 10)}
                min={new Date().toISOString().slice(0, 10)}
                onChange={handleDateChange}
                enabled={true}
              />
            </HDiv>

            <HDiv className="flex-wrap mt-2">
              <InputGroup
                className="form-group position-relative  "
                type="date"
                label="Validity Date"
                name="validity_date"
                min={new Date().toISOString().split("T")[0]}
                value={selectedDate.toISOString().split("T")[0]}
                onChange={(e) => {
                  setSelectedDate(new Date(e.target.value));
                  handleFormChange(e);
                }}
              />
              <SelectGroup
                option={deliveryType}
                className="form-group position-relative "
                label="PO Delivery Type"
                value={formValues.po_delivery_type}
                onChange={(e) => {
                  handleFormChange(e);
                }}
                name="po_delivery_type"
              />
              <InputGroup
                className="form-group position-relative "
                label="Delivery Date"
                onChange={(e) => {
                  handleFormChange(e);
                }}
                value={formValues.delivery_date}
                name="delivery_date"
                type="date"
                required
              />
            </HDiv>
          </Fieldset>
        </Col>
      </Col>
      <Modal className=".modal-xl" show={modalShow} onHide={handleClose}>
        <Modal.Header
          className="w-100 p-3 text-light"
          style={{ backgroundColor: "#397b91", color: "white" }}
        >
          <div className="d-flex  ">
            <p>Vendor</p>
            {/* <img
                        className="pl-5"
                        width="20"
                        src="/assets/images/cross.png"
                        alt=""
                        onClick={handleClose}
                      /> */}
          </div>
        </Modal.Header>
        <Modal.Body style={{ background: "white" }} className="modal-body ">
          <div style={{ borderRadius: "10px" }}>
            <Table
              className="table table-bordered table-striped table-responsive text-wrap mb-5 "
              id="tablelist"
              style={{ borderRadius: "10px" }}
            >
              <thead className=" table-secondary  ">
                <tr className="table-pharmacy  p-4 ">
                  <th className="w180">Sl. No</th>
                  <th className="w180">Vendor</th>
                  <th className="w180">Purchase Cost</th>
                </tr>
                {vendorList?.map((item, index) => {
                  return (
                    <tr>
                      <td className="bg-white text-dark text-center">
                        {index + 1}
                      </td>
                      <td className="bg-white text-dark text-center">
                        {item.vendorname}
                      </td>
                      <td className="bg-white text-dark text-center">
                        {item.purchasecost}
                      </td>
                    </tr>
                  );
                })}
              </thead>
            </Table>
          </div>
        </Modal.Body>
      </Modal>

      <Row className="mt-2 ">
        <Col xs={12} md={6} lg={6}>
          <div className="prq-table">
            <div className="bg-green text-white p-3 text-center border-setup">
              PRQ BROWSER
            </div>
            <Row>
              <Col
                sm={3}
                md={5}
                lg={3}
                className="d-flex gap-2 mt-2 mb-2 rounded"
              >
                <InputGroup
                  className="form-group position-relative w-100"
                  label="PRQ No"
                  name="prq_no"
                  type="text"
                  onChange={handleFormChange}
                  required
                />
              </Col>
              <Col sm={3} md={5} lg={3} className="d-flex gap-2 mt-2 mb-2">
                <InputGroup
                  className="form-group position-relative w-100"
                  label="From Date"
                  name="from_date"
                  type="date"
                  onChange={handleFormChange}
                  required
                />
              </Col>
              <Col sm={3} md={5} lg={3} className="d-flex gap-2 mt-2 mb-2">
                <InputGroup
                  className="form-group position-relative w-100"
                  label="To Date"
                  name="to_date"
                  type="date"
                  onChange={handleFormChange}
                  required
                />
              </Col>
              <Col sm={3} md={5} lg={3} className="d-flex gap-2 mt-2 mb-2">
                <Button
                  className="btn btn-dark p-2 "
                  label="Search"
                  // enabled={vendorName === "selected"}
                  // enabled={searchButtonEnabled}
                  onClick={() => {
                    showVendorAlert();
                    SearchPRQData();
                  }}
                />
              </Col>
            </Row>
            <div style={{ height: "300px", overflowY: "auto" }}>
              <Table responsive>
                <thead className="box-table">
                  <tr>
                    <th>PRQ No</th>
                    <th>Cr.Date</th>
                    <th>Prepared By</th>
                    <th>Remarks</th>
                    <th>To</th>
                    <th>Select</th>
                  </tr>
                </thead>
                <tbody>
                  {PRQBrowserData?.map((data) => {
                    return (
                      <tr>
                        <td className="w180">{data.prqno}</td>
                        <td>{data.crdate}</td>
                        <td>{data.preparedby}</td>
                        <td>{data.remarks}</td>
                        <td className="text-nowrap">{data.toperson}</td>

                        <td className="text-center">
                          <img
                            src="/assets/images/Arrow_Right.svg"
                            alt=""
                            className="cursor-pointer"
                            onClick={() => {
                              setOpenPRQDetails(true);
                              GetPRQDetails(data.id, data.prqno);
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                  {noRecords && <div>No Records found!!</div>}
                </tbody>
              </Table>
            </div>
          </div>
        </Col>

        <Col xs={12} md={6} lg={6}>
          <div className="prq-table">
            <div className="bg-green p-3 text-center text-white border-setup">
              PRQ Details
            </div>

            <div className="d-flex gap-4 p-3 font-weight-bold">
              {storePRQNo}
            </div>
            {PRQDetails && (
              <div style={{ height: "350px", overflowY: "auto" }}>
                <Table responsive id="storetabledata">
                  <thead className="table-secondary">
                    <tr>
                      <th>Description</th>
                      <th>UOM</th>
                      <th>Ordered Qty </th>
                      <th>Required Qty.</th>
                      <th>Main stock</th>
                      <th>Global stock</th>
                      <th>Last Vendor</th>
                      <th>View</th>
                      <th>Comments</th>
                      <th>Add</th>
                      <th>Free</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* openPRQDetails && */}
                    {PRQDetails?.map((data, index) => {
                      localStorage.setItem("itemTypeId", data.itemTypeId);
                      const itemId = data.id;
                      return (
                        <tr>
                          <td className="w180">{data.itemName}</td>
                          <td>{data.uomName}</td>
                          <td>{data.poOrderQty}</td>
                          <td>{data.requiredQty}</td>
                          <td>{data.mainStock}</td>
                          <td>{data.globalstock}</td>
                          <td>{data.vendorName}</td>
                          <td>
                            <img
                              src="/assets/images/Plus_icon.svg"
                              alt=""
                              variant="primary"
                              className="cursor-pointer"
                              onClick={() => {
                                setModalShow(true);
                                // GetVendorList(data.itemId);
                                GetVendorList(31);
                              }}
                            />
                          </td>
                          <td>
                            <InputGroup />
                          </td>
                          <td>
                            <Button
                              className="btn btn-primary p-2"
                              label="Add"
                              onClick={() => {
                                let dataCopy = { ...data };
                                dataCopy.total = 0;
                                dataCopy.grandTotal = 0;
                                dataCopy.discountAmount = 0;
                                dataCopy.discountpercentage = 0;
                                dataCopy.finalTotal = 0;
                                dataCopy.finalDiscount = 0;
                                dataCopy.amtDisabled = false;
                                dataCopy.percentDisabled = false;
                                dataCopy.freeItem = "N";
                                preventItemDuplicates(dataCopy, itemId);
                                setActiveAdd([...activeAdd, index]);
                                setTotal("");
                                setActiveInput("");
                              }}
                            />
                          </td>
                          <td>
                            <Button
                              className="btn btn-success p-2"
                              label="Free"
                              onClick={() => handleFreeModal(data)}
                              enabled={!activeAdd.includes(index)}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            )}
          </div>
        </Col>

        <Modal
          className=".modal-xl"
          size="lg"
          show={freeModal}
          onHide={handleClose}
        >
          <Modal.Header
            className="w-100 p-3 text-light"
            style={{ backgroundColor: "#397b91", color: "white" }}
          >
            <div className="d-flex  ">
              <p>Search Item</p>
            </div>
          </Modal.Header>
          <Modal.Body style={{ background: "white" }} className="modal-body ">
            <div style={{ borderRadius: "10px" }}>
              <div className="d-flex gap-2">
                <InputGroup
                  className="form-group position-relative w-100"
                  label="Description"
                  name="description"
                  type="text"
                  value={formValues.description}
                  onChange={handleFormChange}
                />
                <InputGroup
                  className="form-group position-relative w-100"
                  label="Item Code"
                  name="item_code"
                  type="item_code"
                  value={formValues.item_code}
                  onChange={(e) => handleFormChange(e)}
                />
              </div>
              <div className="d-flex justify-content-end mt-2 mb-2">
                <Button
                  className="btn btn-dark"
                  label="Search"
                  onClick={() => {
                    if (formValues.description !== "") {
                      GetFreeItemsByItemName(
                        hospitalId,
                        subCenterId,
                        itemTypeId,
                        formValues.description
                      );
                    } else {
                      GetFreeItemsByItemCode(
                        hospitalId,
                        subCenterId,
                        itemTypeId,
                        formValues.item_code
                      );
                    }
                  }}
                />
              </div>
              <div style={{ height: "300px", overflowY: "auto" }}>
                <Table id="tablelist" style={{ borderRadius: "10px" }}>
                  <thead className=" table-secondary  ">
                    <tr className="table-pharmacy  p-4 ">
                      <th className="w180">Description</th>
                      <th className="w180">UOM</th>

                      <th className="w180">Required Qty</th>
                      <th className="w180">Main stock</th>
                      <th className="w180">Global stock</th>
                      <th className="w180">Last vendor</th>
                      <th className="w180">Add</th>
                    </tr>
                    {listFreeItems?.map((item, index) => {
                      return (
                        <tr key={item.id}>
                          <td className="bg-white text-dark text-center">
                            {item.itemDescription}
                          </td>
                          <td className="bg-white text-dark text-center">
                            {item.purchaseuomname}
                          </td>

                          <td className="bg-white text-dark text-center">
                            <InputGroup
                              // onChange={handleFormChange}
                              onChange={(e) => {
                                handleFreeItemCalculation(index, e);
                                handleFormChange(e);
                              }}
                              name="required_qty"
                              type="text"
                              // value={formValues.required_qty}
                            />
                          </td>
                          <td className="bg-white text-dark text-center">
                            {item.mainstorestock}
                          </td>
                          <td className="bg-white text-dark text-center">
                            {item.globalstock}
                          </td>
                          <td className="bg-white text-dark text-center">
                            {item.lastvendor}
                          </td>
                          <td className="bg-white text-dark text-center">
                            <Button
                              className="btn btn-primary p-2"
                              label="Add"
                              onClick={() => {
                                setPRQAddedItems([
                                  ...prqAddedItems,
                                  {
                                    prqNumber: storePRQNo,
                                    poOrderQty: Number(formValues.required_qty),
                                    itemName: item.itemDescription,
                                    uomName: item.purchaseuomname,
                                    discountAmount: 0,
                                    discountpercentage: 0,
                                    pendingQty: 0,
                                    unitrate: 0,
                                    grandTotal: 0,
                                    approvedQty: 0,
                                    taxpercentage: 0,
                                    total: 0,
                                    purchaseTotal:discountedTotal,
                                    freeItem: "Y",
                                    brandName: "",
                                    lastModifiedBy: "",
                                    lastModifiedDate: "",
                                    requiredDate: "",
                                    vendorName: "",
                                  },
                                ]);
                                //  freeItemsAdd(item.id)
                                setFreeModal(false);
                                setFormValues({ description: "" });
                                setListFreeItems([]);
                              }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </thead>
                </Table>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        <Modal
          className=".modal-xl"
          size="lg"
          show={showConfirmationPopup}
          onHide={handleClose}
        >
          <Modal.Body style={{ background: "white" }} className="modal-body ">
            <h4>Do you want to add a new item?</h4>

            <br />
            <div className="d-flex justify-content-end gap-2">
              <Button
                className="btn btn-success"
                label="OK"
                onClick={() => {
                  setFreeModal(true);
                  setShowConfirmationPopup(false);
                }}
              />
              <Button
                className="btn btn-danger"
                label="Cancel"
                onClick={() => addSelectedPrqDetailsOnCancelClick()}
              />  

            </div>
          </Modal.Body>
        </Modal>
      </Row>

      <div className="table-responsive rounded mt-2">
        <Table
          responsive
          className="table table-bordered table-striped table-responsive text-wrap mb-5"
          id="storetabledata"
        >
          <thead className="table-secondary">
            <tr>
              <th>PRQ No</th>
              <th>Item code</th>
              <th>Description </th>
              <th>UOM </th>
              <th>Unit Rate </th>
              <th>Request Quantity </th>
              <th>Order Quantity </th>
              <th>Pending Quantity </th>
              <th>Dis.Value</th>
              <th>Discount %</th>
              <th>Additional tax %</th>
              <th>GST Rate</th>
              <th>Total</th>
              <th>Grand Total</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {prqAddedItems.map((data, index) => {
              return (
                <tr
                  style={
                    data.freeItem === "Y"
                      ? { background: "lightblue" }
                      : { background: "whitesmoke" }
                  }
                >
                  <td className="w180">{data.prqNumber}</td>
                  <td>{data.itemCode}</td>
                  <td>{data.itemName}</td>
                  <td>{data.uomName}</td>
                  <td className="w180  text-right">
                    <InputGroup
                      className=" position-relative text-right w130"
                      defaultValue={data.unitrate}
                      onChange={(e) => {
                        handleCalculations(index, e);
                      }}
                      name="unitrate"
                      type="text"
                      inputstyle="text-right"
                      required
                    />
                  </td>
                  <td>
                    <span className="">
                      <InputGroup
                        className=" position-relative text-right"
                        defaultValue={data.approvedQty}
                        name="approved_qty"
                        type="text"
                        required
                        enabled={true}
                      />
                    </span>
                  </td>
                  <td>
                    <InputGroup
                      className=" position-relative"
                      value={
                        data.poOrderQty > data.approvedQty
                          ? Number(data.approvedQty)
                          : Number(data.poOrderQty)
                      }
                      onChange={(e) => {
                        handleCalculations(index, e, data);
                      }}
                      name="poOrderQty"
                      type="text"
                      inputstyle="text-right"
                      required
                    />
                  </td>
                  <td>
                    <InputGroup
                      className=" position-relative"
                      value={
                        data.approvedQty <= data.poOrderQty
                          ? 0
                          : Number(data.approvedQty - data.poOrderQty)
                      }
                      onChange={(e) =>
                        handleInputChange(e, data.id, "pendingQty")
                      }
                      name="pending_qty"
                      inputstyle="text-right"
                      type="text"
                      required
                    />
                  </td>
                  <td>
                    <InputGroup
                      className="position-relative w100"
                      defaultValue={data.discountAmount || 0}
                      onChange={(e) => {
                        handleCalculations(index, e, data);
                      }}
                      enabled={data.amtDisabled}
                      // onFocus={true}
                      inputstyle="text-right"
                      name="discountAmount"
                      type="text"
                    />
                  </td>
                  <td>
                    <InputGroup
                      className="position-relative w100"
                      defaultValue={data.discountpercentage}
                      onChange={(e) => {
                        handleCalculations(index, e, data);
                      }}
                      enabled={data.percentDisabled}
                      inputstyle="text-right"
                      name="discountpercentage"
                      type="text"
                    />
                  </td>
                  <td className="">
                    <InputGroup
                      className=" position-relative"
                      name="cess_percentage"
                      type="text"
                      inputstyle="text-right"
                      required
                    />
                  </td>
                  <td>
                    <InputGroup
                      className=" position-relative w100"
                      value={data.taxpercentage}
                      name="taxpercentage"
                      inputstyle="text-right"
                      type="text"
                      required
                    />
                  </td>
                  <td>
                    <InputGroup
                      className=" position-relative w100"
                      value={data.total || 0}
                      name="total"
                      inputstyle="text-right"
                      type="text"
                      required
                    />
                  </td>
                  <td>
                    <InputGroup
                      className=" position-relative w100"
                      name="grandTotal"
                      value={data.grandTotal}
                      inputstyle="text-right"
                      type="text"
                      required
                    />
                  </td>
                  <td className="text-center">
                    <img
                      src="/assets/images/crossSymbol.png"
                      alt=""
                      className=""
                      onClick={() => handleDelete(data.id)}
                    />
                  </td>
                </tr>
              );
            })}
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <span className="d-flex justify-content-between fs-6 ">
                  <p className="fz-10">Discount value</p>
                  {discountAmtTotal || 0}
                </span>
              </td>
              <td>
                <span className="d-flex justify-content-between fs-6">
                  <p className="fz-10">Discount %</p>
                  {discountPercentageTotal || 0}
                </span>
              </td>
              <td></td>
              <td>
                <span className="d-flex justify-content-between fs-6">
                  <p className="fz-10">GST Amt</p>
                  {gstAmount || 0}
                </span>
              </td>

              <td>
                <span className="d-flex justify-content-between fs-6">
                  <p className="fz-10">Total</p>
                  {totalPrice || 0}
                </span>
              </td>
              <td>
                <span className="d-flex justify-content-between fs-6">
                  <p className="fz-10">Net Total</p>
                  {totalSum || 0}
                </span>
              </td>
              <td></td>
            </tr>
          </tbody>
        </Table>
      </div>
      {/* </Fieldset> */}
      <VDiv>
        <HDiv className=" flex-wrap me-5 mt-1">
          <InputGroup
            className="form-group position-relative flex-grow-1"
            label="Payment terms"
            name="payment_terms"
            type="text"
            onChange={(e) => {
              handleFormChange(e);
            }}
            required
          />
          <InputGroup
            className="form-group position-relative  flex-grow-1"
            label="Warranty"
            name="warranty"
            type="text"
            onChange={(e) => {
              handleFormChange(e);
            }}
            required
          />
          <InputGroup
            className="form-group position-relative  flex-grow-1"
            label="Specification"
            name="specification"
            type="text"
            onChange={(e) => {
              handleFormChange(e);
            }}
            required
          />
          <InputGroup
            className="form-group position-relative  flex-grow-1"
            label="PO Delivery Remarks"
            name="po_delivery_remarks"
            type="text"
            onChange={(e) => {
              handleFormChange(e);
            }}
            required
          />
          <InputGroup
            className="form-group position-relative  flex-grow-1"
            label="Remarks"
            name="remarks"
            type="text"
            onChange={(e) => {
              handleFormChange(e);
            }}
            required
          />
        </HDiv>
        <HDiv className="flex-wrap me-5 mt-3">
          <InputGroup
            className="form-group position-relative  flex-grow-1"
            label="Additional Cost"
            name="additional_cost"
            // defaultValue={formValues.additional_cost}
            onChange={(e) => {
              calculateTotalWithAdditionalCost(e);
              handleFormChange(e);
            }}
            type="text"
            required
          />
          <InputGroup
            className="form-group position-relative  flex-grow-1"
            label="Additional Cost Remarks"
            name="additional_cost_remarks"
            type="text"
            onChange={(e) => {
              handleFormChange(e);
            }}
            required
          />
          <InputGroup
            className="form-group position-relative  flex-grow-1"
            label="Exchange Cost"
            name="exchange_cost"
            onChange={(e) => {
              handleFormChange(e);
              calculateTotalWithExchangeCost(e);
            }}
            type="text"
            required
          />
          <InputGroup
            className="form-group position-relative  flex-grow-1"
            label="Exchange Cost Remarks"
            name="exchange_cost_remarks"
            onChange={(e) => {
              handleFormChange(e);
            }}
            type="text"
            required
          />
          {/* <InputGroup
            className="form-group position-relative  flex-grow-1"
            label="Total Price"
            name="total_price"
            value={totalPrice || 0}
            type="text"
            required
          /> */}
          <InputGroup
            className="form-group position-relative  flex-grow-1"
            label="Total Discount"
            value={discountAmtTotal + discountPercentageTotal}
            name="total_discount"
            type="text"
            required
          />
        </HDiv>
        <HDiv className="flex-wrap me-5 mt-3">
          <InputGroup
            className="form-group position-relative  flex-grow-1"
            label="Total Tax1"
            name="total_tax1"
            type="text"
            required
          />
          <InputGroup
            className="form-group position-relative  flex-grow-1"
            label="Total Tax2"
            name="total_tax2"
            type="text"
            required
          />
          <InputGroup
            className="form-group position-relative  flex-grow-1"
            label="Cess"
            name="cess"
            type="text"
            required
          />
          <InputGroup
            className="form-group position-relative  flex-grow-1"
            label="Final Discount"
            defaultValue={formValues.finalDiscount}
            onChange={(e) => {
              handleFormChange(e);
              calculateGrandTotal(e);
              // calculateTotalWithAdditionalCost(e)
            }}
            name="finalDiscount"
            type="text"
            required
          />
          <InputGroup
            className="form-group position-relative  flex-grow-1"
            label="Grand Total"
            value={Number(discountedTotal?.toFixed(2)) || totalSum}
            name="grand_total"
            type="text"
            required
          />
        </HDiv>
        <HDiv className="me-5 mt-3"></HDiv>
      </VDiv>
      <div className="d-flex justify-content-end gap-2 mt-4 flex-wrap">
        <Button
          className="btn bg-green text-white rounded outline-none border-none"
          label="Save PO"
          onClick={SavePurchaseOrder}
        />
        <Button className="btn bg-secondary text-white" label="Browse PO" />
        <Button
          className="btn bg-danger text-white"
          label="Cancel"
          onClick={() => {
            handleReload();
          }}
        />
      </div>
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

export default connect(mapStateToProps, {})(StorePurchaseOrder);
