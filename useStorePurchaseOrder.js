import { useState } from "react";
import {
  getFreeItemsByItemCode,
  getFreeItemsByItemName,
  getPRQDetails,
  getVendorList,
  getVendorName,
  listStores,
  savePurchaseOrder,
  searchPRQData,
} from "../service/masterServices-storePurchaseOrder";
import { useEffect } from "react";
import { useAlert } from "react-alert";

export const useStorePurchaseOrder = (hospitalId, subCenterId) => {
  const [openPRQBrowser, setOpenPRQBrowser] = useState(false);
  const [openPRQDetails, setOpenPRQDetails] = useState(false);
  const [vendorName, setVendorName] = useState([]);
  const [PRQBrowserData, setPRQBrowserData] = useState();
  const [PRQDetails, setPRQDetails] = useState();
  const [storePRQNo, setStorePRQNo] = useState();
  const [vendorList, setVendorList] = useState();
  const [modalShow, setModalShow] = useState(false);
  const [freeModal, setFreeModal] = useState(false);
  const [listFreeItems, setListFreeItems] = useState([]);
  const [prqAddedItems, setPRQAddedItems] = useState([]);

  const [total, setTotal] = useState("");
  const [totalPrice, setTotalPrice] = useState();
  const [showConfirmationPopup, setShowConfirmationPopup] = useState();
  const [activeInput, setActiveInput] = useState(null);
  const [activeAdd, setActiveAdd] = useState([]);
  const [totalSum, setTotalSum] = useState();

  const [discountedTotal, setDiscountedTotal] = useState();

  const [gstAmount, setGSTAmount] = useState();
  const [store, setStore] = useState();
  const [discountAmount, setDiscountAmount] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(false);
  const [addDataAfterCancellation, setAddDataAfterCancellation] = useState();
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [finalDiscount, setFinalDiscount] = useState();
  const [selectedDate, setSelectedDate] = useState(
    new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)
  ); // set the default date to 30 days from the current date
  const [serverDate, setServerDate] = useState(new Date());
  const [discountAmtTotal, setDiscountAmtTotal] = useState();
  const [discountPercentageTotal, setDiscountPercentageTotal] = useState();
  const [additionalCost, setAdditionalCost] = useState();
  const [unitRateTotal, setUnitRateTotal] = useState();
  const alert = useAlert();

  const locationId = localStorage.getItem("locationId");
  const userId = localStorage.getItem("userId");
  const [formValues, setFormValues] = useState({
    discount_value: "",
    discount_percentage: "",
    description: "",
    item_code: "",
    required_qty: "",
    additional_cost: "",
    finalDiscount: "",
    exchange_cost: "",
    po_delivery_type: "",
    delivery_date: "",
    payment_terms: "",
    warranty: "",
    specification: "",
    po_delivery_remarks: "",
    remarks: "",
    additional_cost_remarks: "",
    exchange_cost_remarks: "",
    vendor: "",
    validity_date: selectedDate.toISOString().split("T")[0],
  });

  const [PRQFormValues, setPRQFormValues] = useState({
    unit_rate: "",
    poOrderQty: "",
    discount_value: "",
    discount_percentage: "",
    cess_percentage: "",
    tax_percentage: "",
    total: totalPrice,
    grand_total: "",
  });

  const status = [
    {
      name: "Open",
      value: "O",
    },
    {
      name: "Partially Processed",
      value: "PO",
    },
  ];
  const type = [
    {
      name: "Open",
      value: "O",
    },
    {
      name: "Processed",
      value: "PO",
    },
    {
      name: "Partially Processed",
      value: "PP",
    },
  ];
  const deliveryType = [
    {
      name: "Standing",
      value: "standing",
    },
    {
      name: "Staggered",
      value: "Staggered",
    },
    {
      name: "One-time",
      value: "one-time",
    },
  ];


  const freeItemsAdd = (itemId) =>{

      


      const newItem = {
        ...prqAddedItems,
        poOrderQty: 0,
        total: 0,
        grandTotal: 0,
        discountAmount: 0,
        discountpercentage: 0,
        purchaseTotal:discountedTotal
        // finalTotal: 0,
        // finalDiscount: 0,
      };
      setPRQAddedItems((prevData) => [...prevData, newItem]);

      
  }

  
  
 const preventItemDuplicates = (data, itemId) => {
    const existingIndex = prqAddedItems.findIndex((i) => i.id === itemId);

    if (existingIndex !== -1) {
      let prqAddedItemsCopy = [...prqAddedItems];
      let discount = 0;
      let total =
        prqAddedItemsCopy[existingIndex]["unitrate"] *
        prqAddedItemsCopy[existingIndex]["poOrderQty"];

      // prqAddedItemsCopy[existingIndex][e.target.name] = e.target.value;
      if (prqAddedItemsCopy[existingIndex]["discountpercentage"] > 0) {
        discount =
          (total * prqAddedItemsCopy[existingIndex]["discountpercentage"]) /
          100;
      } else {
        discount = prqAddedItemsCopy[existingIndex]["discountAmount"];
      }
      let tax =
        ((total - discount) *
          prqAddedItemsCopy[existingIndex]["taxpercentage"]) /
        100;
      // let cess = ((total-discount)*prqAddedItemsCopy[index]["taxpercentage"])/100;

      let grandTotal = total - discount + tax;

      let test = [...prqAddedItems];
      test = test.map((obj, i) => {
        let orderQuantity = Number(obj.poOrderQty) + 1;
        // if (orderQuantity < Number(obj.approvedQty)) {
        return i === existingIndex
          ? {
              ...obj,
              unitrate: obj.unitrate,
              poOrderQty: Number(orderQuantity),
              total: orderQuantity * obj.unitrate,
              grandTotal: obj.grandTotal + grandTotal,
            }
          : { ...obj };
        // } else {
        // alert("enter valid no");
        // }
      });

      setPRQAddedItems(test);

      // const updatedItems = [...prqAddedItems];
      // updatedItems[existingIndex]["poOrderQty"] += 1;
      // setPRQAddedItems(updatedItems);
    } else {
      const newItem = {
        ...data,
        poOrderQty: 1,
        total: 0,
        grandTotal: 0,
        discountAmount: 0,
        discountpercentage: 0,
        // finalTotal: 0,
        // finalDiscount: 0,
      };
      setPRQAddedItems((prevData) => [...prevData, newItem]);
    }
  };

  const handleDateChange = (event) => {
    setServerDate(event.target.value);
  };

  const handleClose = () => {
    setModalShow(false);
    setFreeModal(false);
    setShowConfirmationPopup(false);
    setListFreeItems([]);
  };

  const handleFreeModal = (data) => {
    localStorage.setItem("description", data.itemName);
    localStorage.setItem("itemCode", data.itemCode);
    setAddDataAfterCancellation(data);
    setShowConfirmationPopup(true);
  };

  const addSelectedPrqDetailsOnCancelClick = () => {
    setShowConfirmationPopup(false);
    const existingIndex = prqAddedItems.findIndex(
      (i) => i.id === addDataAfterCancellation.id
    );
    if (existingIndex !== -1) {
      setPRQAddedItems((prqAddedItems) =>
        prqAddedItems.map((obj, i) =>
          i === existingIndex
            ? {
                ...obj,
                poOrderQty: obj.poOrderQty + 1,
                total: obj.poOrderQty * obj.unitrate,
              }
            : { ...obj }
        )
      );
      // const updatedItems = [...prqAddedItems];

      // updatedItems[existingIndex]["poOrderQty"] += 1;
      // setPRQAddedItems(updatedItems);
    } else {
      const newItem = {
        ...addDataAfterCancellation,
        poOrderQty: addDataAfterCancellation.unitrate * 1,
        total: 0,
        grandTotal: 0,
        discountAmount: 0,
        discountpercentage: 0,
        finalTotal: 0,
        finalDiscount: 0,
      };
      setPRQAddedItems((prevData) => [...prevData, newItem]);
    }
  };

  let totalPriceCount = 0;
  for (let i = 0; i < prqAddedItems.length; i++) {
    totalPriceCount += prqAddedItems[i].total;
  }

  useEffect(() => {
    setTotalPrice(totalPriceCount.toFixed(2));
  }, [totalPriceCount]);

  let totalCount = 0;
  for (let i = 0; i < prqAddedItems.length; i++) {
    totalCount += prqAddedItems[i].grandTotal;
  }

  let GSTAmount = 0;
  for (let i = 0; i < prqAddedItems.length; i++) {
    let gst = (prqAddedItems[i].taxpercentage * prqAddedItems[i].total) / 100;
    GSTAmount += gst;
  }

  useEffect(() => {
    setGSTAmount(GSTAmount.toFixed(2));
  }, [GSTAmount]);

  let unitRate = 0;
  for (let i = 0; i < prqAddedItems.length; i++) {
    unitRate += Number(prqAddedItems[i].unitrate);
  }

  useEffect(() => {
    setUnitRateTotal(unitRate);
  }, [unitRate]);

  const handleDiscountValueFocus = () => {
    setActiveInput("discount_value");
  };

  const handleDiscountPercentageFocus = () => {
    setActiveInput("discount_percentage");
  };
  const handleFormChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleInputChange = (event, rowId, columnName) => {
    const newValue = event.target.value;
    setPRQFormValues((prevValues) => {
      return {
        ...prevValues,
        [rowId]: {
          ...prevValues[rowId],
          unitrate: event.target.value,
        },
      };
    });

    const updatedTableData = prqAddedItems.map((row) =>
      row.id === rowId ? { ...row, [columnName]: newValue } : row
    );
    setPRQAddedItems(updatedTableData);
  };

  useEffect(() => {
    setAdditionalCost(formValues?.additional_cost);
    setFinalDiscount(formValues?.finalDiscount);
  }, [formValues]);

  // useEffect(() => {}, [formValues]);

  useEffect(() => {
    setTotalSum(totalCount.toFixed(2));
    setDiscountedTotal(
      Number(totalCount) +
        Number(formValues.additional_cost) -
        Number(formValues.finalDiscount)
    );
  }, [totalCount]);

  useEffect(() => {
    setDiscountedTotal(
      Number(totalCount) +
        Number(formValues.additional_cost) -
        Number(formValues.finalDiscount)
    );
  }, [formValues.additional_cost, formValues.finalDiscount]);

  useEffect(() => {
    setDiscountedTotal(
      Number(totalCount) +
        Number(formValues.additional_cost) +
        Number(formValues.exchange_cost) -
        Number(formValues.finalDiscount)
    );
  }, [
    formValues.additional_cost,
    formValues.finalDiscount,
    formValues.exchange_cost,
  ]);

  const handleFreeItemCalculation = (index, e) => {
    let listFreeItemsCopy = [...listFreeItems];
    listFreeItemsCopy[index][e.target.name] = e.target.value;
    listFreeItemsCopy[index]["required_qty"] = e.target.value;
  };

  const calculateTotalWithAdditionalCost = (e) => {
    if (Number(finalDiscount) && e.target.value) {
      setDiscountedTotal(
        Number(totalSum) + Number(e.target.value) - Number(finalDiscount)
      );
    } else if (!finalDiscount && e.target.value) {
      setDiscountedTotal(Number(totalSum) + Number(e.target.value));
    } else if (finalDiscount && !e.target.value) {
      setDiscountAmount(Number(totalSum) - Number(finalDiscount));
    } else {
      setDiscountedTotal(Number(totalSum));
      setTotalSum(
        Number(totalSum) + Number(e.target.value) - Number(finalDiscount)
      );
    }
  };
  const calculateTotalWithExchangeCost = (e) => {
    if (Number(finalDiscount) && e.target.value) {
      setDiscountedTotal(
        Number(totalSum) + Number(e.target.value) - Number(finalDiscount)
      );
    } else if (!finalDiscount && e.target.value) {
      setDiscountedTotal(Number(totalSum) + Number(e.target.value));
    } else if (finalDiscount && !e.target.value) {
      setDiscountAmount(Number(totalSum) - Number(finalDiscount));
    } else if (finalDiscount && e.target.value && additionalCost) {
      setDiscountedTotal(
        Number(totalSum) +
          Number(e.target.value) +
          Number(additionalCost) -
          Number(finalDiscount)
      );
    } else {
      setDiscountedTotal(Number(totalSum));
      setTotalSum(
        Number(totalSum) + Number(e.target.value) - Number(finalDiscount)
      );
    }
  };

  let totalDisAmt = 0;
  for (let i = 0; i < prqAddedItems.length; i++) {
    totalDisAmt += Number(prqAddedItems[i].discountAmount);
  }

  useEffect(() => {
    setDiscountAmtTotal(totalDisAmt);
  }, [totalDisAmt]);

  let totalDisPercent = 0;

  for (let i = 0; i < prqAddedItems.length; i++) {
    totalDisPercent =
      totalDisPercent +
      (Number(prqAddedItems[i].discountpercentage) *
        Number(prqAddedItems[i].total)) /
        100;
  }

  useEffect(() => {
    setDiscountPercentageTotal(totalDisPercent);
  }, [totalDisPercent]);

  const handleFreeItemsAdd = (description, purchaseuomname, item) => {
    const prqAddedItemsCopy = [...prqAddedItems];
    setPRQAddedItems([
      ...prqAddedItemsCopy,
      {
        ...item,
        prqNumber: storePRQNo,
        poOrderQty: Number(formValues.required_qty),
        itemName: description,
        uomName: purchaseuomname,
        discountAmount: 0,
        discountpercentage: 0,
        pendingQty: 0,
        unitrate: 0,
        grandTotal: 0,
        approvedQty: 0,
        taxpercentage: 0,
        total: 0,
        brandName: "",
        lastModifiedBy: "",
        lastModifiedDate: "",
        requiredDate: "",
        vendorName: "",
      },
    ]);
    setFreeModal(false);
    setFormValues({ description: "" });
    setListFreeItems([]);
  };

  const handleCalculations = (index, e) => {
    let prqAddedItemsCopy = [...prqAddedItems];
    prqAddedItemsCopy[index][e.target.name] = e.target.value;

    if (
      prqAddedItemsCopy[index]["poOrderQty"] >
      prqAddedItemsCopy[index]["approvedQty"]
    ) {
      // const updatedPrqAddedItems = [...prqAddedItems];
      prqAddedItemsCopy[index]["poOrderQty"] =
        prqAddedItemsCopy[index]["approvedQty"];
    }

    if (
      e.target.name === "discountpercentage" ||
      e.target.name === "discountAmount"
    ) {
      if (
        (prqAddedItemsCopy[index]["discountpercentage"] == "" &&
          prqAddedItemsCopy[index]["discountAmount"] == "") ||
        (prqAddedItemsCopy[index]["discountpercentage"] == 0 &&
          prqAddedItemsCopy[index]["discountAmount"] == 0)
      ) {
        prqAddedItemsCopy[index]["amtDisabled"] = false;
        prqAddedItemsCopy[index]["percentDisabled"] = false;
      } else if (
        (prqAddedItemsCopy[index]["discountAmount"] !== "" &&
          prqAddedItemsCopy[index]["discountpercentage"] == "") ||
        (prqAddedItemsCopy[index]["discountAmount"] != 0 &&
          prqAddedItemsCopy[index]["discountpercentage"] == "")
      ) {
        prqAddedItemsCopy[index]["amtDisabled"] = false;
        prqAddedItemsCopy[index]["percentDisabled"] = true;
      } else if (
        prqAddedItemsCopy[index]["discountpercentage"] !== 0 ||
        prqAddedItemsCopy[index]["discountpercentage"] !== ""
      ) {
        prqAddedItemsCopy[index]["amtDisabled"] = true;
        prqAddedItemsCopy[index]["percentDisabled"] = false;
      }
    }

    if (e.target.name === "poOrderQty") {
      const unitrate = prqAddedItemsCopy[index]["unitrate"];
      const poOrderQty = e.target.value;
      prqAddedItemsCopy[index]["total"] = unitrate * poOrderQty;
    }

    let discount = 0;
    let total =
      prqAddedItemsCopy[index]["unitrate"] *
      prqAddedItemsCopy[index]["poOrderQty"];

    prqAddedItemsCopy[index][e.target.name] = e.target.value;
    if (prqAddedItemsCopy[index]["discountpercentage"] > 0) {
      discount = (total * prqAddedItemsCopy[index]["discountpercentage"]) / 100;
    } else {
      discount = prqAddedItemsCopy[index]["discountAmount"];
    }

    let tax =
      ((total - discount) * prqAddedItemsCopy[index]["taxpercentage"]) / 100;
    // let cess = ((total-discount)*prqAddedItemsCopy[index]["taxpercentage"])/100;

    let grandTotal = total - discount + tax;

    // setDiscountedTotal(discountedTotal + grandTotal);
    // setDiscountedTotal(Number(totalSum) + Number(formValues.additional_cost) + Number(formValues.finalDiscount));

    prqAddedItemsCopy[index]["total"] = total;

    prqAddedItemsCopy[index]["grandTotal"] = grandTotal;

    setPRQAddedItems(prqAddedItemsCopy);
  };

  const handleDelete = (id) => {
    const newItems = prqAddedItems.filter((item) => item.id !== id);
    setPRQAddedItems(newItems);
    alert.show("Deleted 1 item");
    // setDiscountedTotal("");
  };
  const GetVendorName = async () => {
    try {
      const response = await getVendorName(hospitalId, subCenterId);
      if (response?.status === 302) {
        const vendors = response?.data?.map((item) => ({
          value: item.id,
          name: item.vendorName,
        }));

        setVendorName(vendors);
        // setSelectedVendor(null);
      } else {
        setVendorName([]);
        // setSelectedVendor(null);
      }
    } catch (error) {
      setVendorName([]);
      // setSelectedVendor(null);
    }
  };

  const SearchPRQData = async () => {
   let inchargeId = localStorage.getItem("inchargeId")
    if (selectedVendor !== null) {
      const body = {
        // prqno:"",
        prqno: formValues.prq_no || "",
        hospitalId: hospitalId,
        storeId: 39,
        // storeId: locationId,
        subcenterid: subCenterId,
        fromdate: formValues.from_date || "",
        toDate: formValues.to_date || "",
        toperson: inchargeId,
      };

      const response = await searchPRQData(body);

      if (response.status === 302) {
        setPRQBrowserData(response.data);
      }
    }

    // else if(response.status === 204){
    //   setNoRecords(true)
    // }else{

    // setNoRecords(true)
    // }
  };

  const GetPRQDetails = async (id, prqno) => {
    const response = await getPRQDetails(id);
    setStorePRQNo(prqno);
    setPRQDetails(response.data);
  };

  const GetVendorList = async (itemId) => {
    const response = await getVendorList(itemId);
    setVendorList(response.data);
  };

  const GetFreeItemsByItemName = async (
    hostpitalId,
    subCenterId,
    itemTypeId,
    itemName
  ) => {
    const response = await getFreeItemsByItemName(
      hostpitalId,
      subCenterId,
      itemTypeId,
      itemName
    );
    if (response) {
      setListFreeItems(response.data);
    } else {
      setListFreeItems([]);
    }
  };
  const GetFreeItemsByItemCode = async (
    hostpitalId,
    subCenterId,
    itemTypeId,
    itemCode
  ) => {
    const response = await getFreeItemsByItemCode(
      hostpitalId,
      subCenterId,
      itemTypeId,
      itemCode
    );
    if (response) {
      setListFreeItems(response.data);
    } else {
      setListFreeItems([]);
    }
  };

  const ListStores = async () => {
    try {
      const response = await listStores(hospitalId, subCenterId);
      if (response?.status === 302) {
        const stores = response?.data?.map((item, index) => ({
          value: item?.id,
          name: item?.storeName,
        }));

      localStorage.setItem("inchargeId",response.data[0].inchargeId)
        
        setStore(stores);
      } else {
        setStore([]);
      }
    } catch (error) {
      setStore([]);
    }
  };

  let vatVal = Number(gstAmount);

  console.log(discountedTotal,"after adding free item");
  

  const SavePurchaseOrder = async () => {
    const body = {
      hospitalId: hospitalId,
      subcenterId: subCenterId,
      vendorId: formValues.vendor,
      deptId: locationId,
      itemTypeId: 14,
      deliveryType: formValues.po_delivery_type,
      poValiddityDate: formValues.validity_date,
      // poValiddityDate: "01-12-2023",
      // poDeliveryDate: "25-12-2024",
      // poValiddityDate: "12-05-2023",
      poDeliveryDate: formValues.delivery_date,
      // poDeliveryDate: "12-06-2023",
      purchaseTotal: discountedTotal,
      // vatVal: gstAmount,
      vatVal: vatVal,
      cessVal: 0,
      paymentTerms: formValues.payment_terms,
      warrantyTerms: formValues.warranty,
      additionalCost: formValues.additional_cost,
      addCostRemarks: formValues.additional_cost_remarks,
      deliveryRemarks: formValues.po_delivery_remarks,
      totDiscount: discountAmtTotal + discountPercentageTotal,
      finalDiscount: formValues.finalDiscount,
      specification: formValues.specification,
      totalUnitPrice: unitRateTotal,
      exchangeCost: formValues.exchange_cost,
      exchangeCostRemarks: formValues.exchange_cost_remarks,
      active: "Y",
      remarks: formValues.remarks,
      enteredBy: userId,
      purchaseOrderDetails: prqAddedItems.map((item) => ({
        hospitalId: hospitalId,
        subcenterId: subCenterId,
        purchaseRequestDetails: item.id,
        prqNumber: item.prqNumber,
        itemId: item.itemId,
        uomId: item.uomId,
        unitRate: item.unitrate,
        itemTypeId: item.itemTypeId,
        requiredQuantity: item.requiredQty,
        approvedQuantity: item.approvedQty,
        totPrice: item.total,
        discountRate: item.discountpercentage || item.discountAmount,
        expDeliveryDate: "",
        vatVal: item.taxpercentage,
        cessValue: 0,
        grantTotal: item.grandTotal,
        deliveryRemarks: formValues.po_delivery_remarks,
        receivedQuantity: item.poOrderQty,
        mrpQuoted: 0,
        amendmentAmount: item.unitrate,
        approvedBy: "",
        amendmentBy: "",
        amendmentDate: "",
        discountValue: item.discountpercentage || item.discountAmount,
        specification: " ",
        active: "Y",
        remarks: formValues.remarks,
        enteredBy: userId,
      })),
    };

    const response = await savePurchaseOrder(body);
     console.log(response);
     
    if (response.status === 201) {
      alert.show("Purchase Order Save Successful");
      // setTimeout(() => {
      //   handleReload();
      // }, 2000);
    } else {
      alert.show("Save failed");
    }

  };

  const handleReload = () => {
    window.location.reload();
  };

  useEffect(() => {
    GetVendorName();
  }, []);

  useEffect(() => {
    ListStores();
  }, []);

  return {
    openPRQBrowser,
    setOpenPRQBrowser,
    openPRQDetails,
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
    freeModal,
    handleFreeModal,
    GetFreeItemsByItemName,
    GetFreeItemsByItemCode,
    listFreeItems,
    setListFreeItems,
    prqAddedItems,
    setPRQAddedItems,
    handleDelete,
    setFreeModal,
    formValues,
    setFormValues,
    showConfirmationPopup,
    setShowConfirmationPopup,
    activeInput,
    setActiveInput,
    addSelectedPrqDetailsOnCancelClick,
    handleInputChange,
    handleDiscountValueFocus,
    handleDiscountPercentageFocus,
    activeAdd,
    setActiveAdd,
    PRQFormValues,
    setPRQFormValues,
    total,
    setTotal,
    totalPrice,
    setTotalPrice,
    handleCalculations,
    totalSum,
    discountedTotal,
    gstAmount,
    discountAmount,
    setDiscountAmount,
    discountPercentage,
    setDiscountPercentage,
    store,
    ListStores,
    serverDate,
    setServerDate,
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
    handleFreeItemsAdd,
    handleFreeItemCalculation,
    freeItemsAdd
  };
};
