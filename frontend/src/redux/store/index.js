import { configureStore, combineReducers } from "@reduxjs/toolkit"
import authReducer from "../reducers/auth"
import rolesReducer from "../reducers/roles"
import permissionsReducer from "../reducers/permissions"
import usersReducer from "../reducers/users"
import jobOffersReducer from "../reducers/jobOffers"
import worksReducer from "../reducers/works"
import quotesReducer from "../reducers/quotes"
import invoicesReducer from "../reducers/invoices"
import projectsReducer from "../reducers/projects"
import applicationsReducer from "../reducers/applications"
import interviewsReducer from "../reducers/interviews"

const mainReducer = combineReducers({
  auth: authReducer,
  roles: rolesReducer,
  permissions: permissionsReducer,
  users: usersReducer,
  jobOffers: jobOffersReducer,
  works: worksReducer,
  quotes: quotesReducer,
  invoices: invoicesReducer,
  projects: projectsReducer,
  applications: applicationsReducer,
  interviews: interviewsReducer,
})

const store = configureStore({
  reducer: mainReducer,
})

export default store
