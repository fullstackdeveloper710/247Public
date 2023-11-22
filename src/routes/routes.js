import React from "react";
import UserManagement from "pages/Admin/UserManagement";
import CreateUsers from "pages/Admin/CreateUsers";
import { ROUTES, TITLE } from "routes/constant";
import OrderManagement from "pages/Admin/OrderManagement";
import OrderDetails from "pages/Admin/OrderDetails";
import Update from "pages/Admin/Update/Update";
import Profile from "pages/Admin/Profile/Profile";
import EditProfile from "pages/Admin/EditProfile/EditProfile";
import SignIn from "pages/Admin/Auth/SignIn";
import Register from "pages/Admin/Auth/Register";
import ResetPassword from "pages/Admin/Auth/ResetPassword";
import ForgetPassword from "pages/Admin/Auth/ForgetPassword";
import NotFound from "pages/Admin/NotFound";
import PublicLayout from "layout/Admin/PublicLayout";
import PrivateLayout from "layout/Admin/PrivateLayout";
import Dashboard from "pages/Admin/Dashboard";
import Billings from "pages/Admin/Billings";
import ManageHolidays from "pages/Admin/ManageHolidays";
import Workload from "pages/Admin/Workload";
import ClientUsers from "pages/Admin/ClientUsers";
import _ from "lodash";
import UserFileDetails from "pages/Admin/UserFileDetails";
import CreatePassword from "pages/Admin/Auth/CreatePassword";
import RegisterVerification from "pages/Admin/Auth/RegisterVerification";
import ErrorPage from "pages/Admin/Auth/ErrorPage";
import DocumentDetails from "pages/Admin/DocumentDetails";
import { allRoles, primaryRoles, rolesForApproval, secondaryRoles, superAdminRoles } from "util/helpers";
import Approval from "pages/Admin/Approval";
import CreateCustomUsers from "pages/Admin/CreateUsers/CustomUsers";
import AccessibleInvoice from "pages/Admin/Update/Sections/Invoice/AccessibleInv/AccessibleInvoice";
import ClientOrders from "pages/Admin/ClientOrders";
import InvoiceDetails from "pages/Admin/InvoiceDetails";



const allRoutes = [
  {
    path: ROUTES.SIGN_IN,
    element: (
      <PublicLayout title={TITLE.MANAGE_USERS_TITLE}>
        <SignIn />
      </PublicLayout>
    ),
  },
  {
    path: ROUTES.REGISTER_VERIFICATION,
    element: (
      <PublicLayout>
        <RegisterVerification />
      </PublicLayout>
    ),
  },
  {
    path: ROUTES.REGISTER,
    element: (
      <PublicLayout title={TITLE.MANAGE_USERS_TITLE}>
        <Register />
      </PublicLayout>
    ),
  },
  {
    path: ROUTES.RESET_PASSWORD,
    element: (
      <PublicLayout title={TITLE.MANAGE_USERS_TITLE}>
        <ResetPassword />
      </PublicLayout>
    ),
  },
  {
    path: ROUTES.FORGET_PASSWORD,
    element: (
      <PublicLayout title={TITLE.MANAGE_USERS_TITLE}>
        <ForgetPassword />
      </PublicLayout>
    ),
  },
  {
    path: ROUTES.CREATE_PASSWORD,
    element: (
      <PublicLayout title={TITLE.MANAGE_USERS_TITLE}>
        <CreatePassword />
      </PublicLayout>
    ),
  },
  {
    path: ROUTES.ERROR_PAGE,
    element: (
      <PublicLayout title={TITLE.MANAGE_USERS_TITLE}>
        <ErrorPage />
      </PublicLayout>
    ),
  },
  {
    path: ROUTES.NOT_FOUND,
    element: <NotFound />,
  },
  //company routes
  {
    path: ROUTES.ORDER_MANAGEMENT,
    element: (
      <PrivateLayout title={TITLE.ORDER_MANAGEMENT_TITLE} roles={allRoles}>
        <OrderManagement />
      </PrivateLayout>
    ),
  },
  {
    path: ROUTES.CLIENT_ORDER_MANAGEMENT,
    element: (
      <PrivateLayout title={TITLE.CLIENT_ORDER_MANAGEMENT_TITLE} roles={superAdminRoles}>
        <ClientOrders />
      </PrivateLayout>
    ),
  },
  {
    path: ROUTES.ACCESSIBLE_INVOICE,
    element: (
      <PrivateLayout title={TITLE.ACCESSIBLE_INVOICE_TITLE} roles={[...superAdminRoles,...primaryRoles]}>
        <AccessibleInvoice />
      </PrivateLayout>
    ),
  },
  {
    path: ROUTES.ORDER_DETAILS_BY_ID,
    element: (
      <PrivateLayout title={TITLE.ORDER_DETAILS_TITLE} roles={allRoles}>
        <OrderDetails />
      </PrivateLayout>
    ),
  },
 
  {
    path: ROUTES.UPDATE,
    element: (
      <PrivateLayout title={TITLE.UPDATE_TITLE} roles={allRoles}>
        <Update />
      </PrivateLayout>
    ),
  },
  {
    path: ROUTES.PROFILE,
    element: (
      <PrivateLayout title={TITLE.PROFILE_TITLE} roles={allRoles}>
        <Profile />
      </PrivateLayout>
    ),
  },
  {
    path: ROUTES.EDIT_PROFILE,
    element: (
      <PrivateLayout title={TITLE.EDIT_PROFILE_TITLE} roles={allRoles}>
        <EditProfile />
      </PrivateLayout>
    ),
  },
  {
    path: ROUTES.DASHBOARD,
    element: (
      <PrivateLayout title={TITLE.DASHBOARD_TITLE} roles={allRoles}>
        <Dashboard />
      </PrivateLayout>
    ),
  },
  //user Routes
  {
    path: ROUTES.BILLINGS,
    element: (
      <PrivateLayout title={TITLE.BILLINGS_TITLE} roles={primaryRoles}>
        <Billings />
      </PrivateLayout>
    ),
  },

  //admin and root admin

  {
    path: ROUTES.MANAGE_USERS,
    element: (
      <PrivateLayout title={TITLE.MANAGE_USERS_TITLE} roles={secondaryRoles}>
        <UserManagement />
      </PrivateLayout>
    ),
  },
  {
    path: ROUTES.ADD_NEW_USER,
    element: (
      <PrivateLayout title={TITLE.ADD_NEW_USER_TITLE} roles={secondaryRoles}>
        <CreateUsers />
      </PrivateLayout>
    ),
  },
  {
    path: ROUTES.UPDATE_USER,
    element: (
      <PrivateLayout title={TITLE.UPDATE_USER_TITLE} roles={secondaryRoles}>
        <CreateUsers />
      </PrivateLayout>
    ),
  },

  {
    path: ROUTES.APPROVAL_LIST,
    element: (
      <PrivateLayout title={TITLE.APPROVAL_LIST_TITLE} roles={rolesForApproval}>
        <Approval />
      </PrivateLayout>
    ),
  },

  //super admin
  {
    path: ROUTES.MANAGE_HOLIDAYS,
    element: (
      <PrivateLayout
        title={TITLE.MANAGE_HOLIDAYS_TITLE}
        roles={superAdminRoles}
      >
        <ManageHolidays />
      </PrivateLayout>
    ),
  },
  {
    path: ROUTES.WORKLOAD,
    element: (
      <PrivateLayout title={TITLE.WORKLOAD_TITLE} roles={superAdminRoles}>
        <Workload />
      </PrivateLayout>
    ),
  },
  {
    path: ROUTES.CLIENT_USERS,
    element: (
      <PrivateLayout title={TITLE.CLIENT_USERS_TITLE} roles={superAdminRoles}>
        <ClientUsers />
      </PrivateLayout>
    ),
  },
  {
    path: ROUTES.CLIENT_INVOICE_DETAILS,
    element: (
      <PrivateLayout title={TITLE.CLIENT_INVOICE_DETAILS_TITLE} roles={superAdminRoles}>
        <InvoiceDetails />
      </PrivateLayout>
    ),
  },
  {
    path: ROUTES.USERS_FILE_DETAILS,
    element: (
      <PrivateLayout
        title={TITLE.USERS_FILE_DETAILS_TITLE}
        roles={superAdminRoles}
      >
        <UserFileDetails />
      </PrivateLayout>
    ),
  },
  {
    path: ROUTES.DOCUMENT_DETAILS,
    element: (
      <PrivateLayout
        title={TITLE.DOCUMENT_DETAILS_TITLE}
        roles={superAdminRoles}
      >
        <DocumentDetails />
      </PrivateLayout>
    ),
  },
  {
    path: ROUTES.ADD_NEW_CUSTOM_USER,
    element: (
      <PrivateLayout
        title={TITLE.ADD_NEW_CUSTOM_USER_TITLE}
        roles={superAdminRoles}
      >
        <CreateCustomUsers />
      </PrivateLayout>
    ),
  },
  {
    path: ROUTES.UPDATE_CUSTOM_USER,
    element: (
      <PrivateLayout
        title={TITLE.UPDATE_CUSTOM_USER_TITLE}
        roles={superAdminRoles}
      >
        <CreateCustomUsers />
      </PrivateLayout>
    ),
  },
];

export default allRoutes;
