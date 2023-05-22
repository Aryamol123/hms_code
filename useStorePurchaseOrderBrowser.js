import { useState } from "react";
// import { getVendorName } from "../service/masterServices-storePurchaseOrderBrowser";
import { useEffect } from "react";
import { getVendorName } from "../service/masterServices-storePurchaseOrder";
import {
  findPoDetailsById,
  getSearchDetailsData,
  poSearch,
  updateSpecification,
} from "../service/masterServices-storePurchaseOrderBrowser";
import { useStorePurchaseOrder } from "./useStorePurchaseOrder";
import { useNavigate } from "react-router";

const useStorePurchaseOrderBrowser = (hospitalId, subCenterId) => {
  const [vendorName, setVendorName] = useState();
  const [formValues, setFormValues] = useState({
    from_date: "",
    to_date: "",
    po_number: "",
    item_code: "",
    item_description: "",
    vendor: "",
    details_specification: "",
  });
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().substr(0, 10)
  );
  const [searchData, setSearchData] = useState();
  const [view, setView] = useState(false);
  const [masterDetails, setMasterDetails] = useState();
  const [viewPageDetails, setViewPageDetails] = useState();
  const [specificationPageView, setSpecificationPageView] = useState();
  const {prqAddedItems,setPRQAddedItems} = useStorePurchaseOrder();
 const navigate = useNavigate()
  const poStatus = [
    {
      name: "Closed",
      value: "closed",
    },
    {
      name: "Approved",
      value: "A",
    },
    {
      name: "Open",
      value: "O",
    },
  ];
  const processingStatus = [
    {
      name: "Processed",
      value: "P",
    },
    {
      name: "Partially Processed",
      value: "PD",
    },
  ];

  const handleFormChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleDateChange = (e) => {
    setCurrentDate(e.target.value);
  };
  const GetVendorName = async () => {
    try {
      const response = await getVendorName(hospitalId, subCenterId);
      if (response?.status === 302) {
        const vendors = response?.data?.map((item) => ({
          value: item.id,
          name: item.vendorName,
        }));
        console.log(response, "responsee");

        setVendorName(vendors);
      } else {
        setVendorName([]);
      }
    } catch (error) {
      setVendorName([]);
    }
  };

  const PoSearch = async (e) => {
    e.preventDefault();
    const body = {
      hospitalId: hospitalId,
      subcenterId: subCenterId,
      poNumber: "",
      storeId: 35,
      vendorId: formValues.vendor,
      fromDate: formValues.from_date,
      toDate: formValues.to_date,
      itemCode: "",
      itemDescription: "",
      poStatus: "",
      itemDeliveryStatus: "",
    };

    const response = await poSearch(body);

    setSearchData(response?.data);
  };

  const GetSearchDetailsData = async (id) => {
    try {
      const response = await getSearchDetailsData(id);
      setViewPageDetails(response.data);
    } catch (error) {}
  };
  const UpdateSpecification = async (e, itemId) => {
    e.preventDefault();
    try {
      const params = new URLSearchParams();
      params.append("specification", formValues.details_specification);

      const response = await updateSpecification(params, itemId);
      if (response.status === 302) {
        setViewPageDetails(response.data);
        alert("Successfully updated");
      }
    } catch (error) {}
  };

  const FindPoDetailsById = async (id) => {
    try {
      const response = await findPoDetailsById(id);
     const data = response.data
    //  navigate('/store-purchase-order',{ state: { apiData: data } })
    } catch (error) {}
  };

  useEffect(() => {
    GetVendorName();
  }, []);
  useEffect(() => {
    GetSearchDetailsData();
  }, []);

  return {
    GetVendorName,
    vendorName,
    poStatus,
    processingStatus,
    PoSearch,
    handleFormChange,
    handleDateChange,
    currentDate,
    formValues,
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
    FindPoDetailsById,
  };
};

export default useStorePurchaseOrderBrowser;
