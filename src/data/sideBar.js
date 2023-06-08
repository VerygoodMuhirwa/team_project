import Depatments from '../assets/department.png' 
import student from '../assets/cap.png'
import teacher from '../assets/teacher.png'
import subjects from '../assets/subjects.png'
import invoices from '../assets/invoices.png'
import account from '../assets/accounts.png'
import holiday from '../assets/holiday.png'
import fees from '../assets/fees.png'
import exams from '../assets/list.png'
import events from '../assets/calendar.png'
import timetable from '../assets/timetable.png'
import library from '../assets/book.png'
import blogs from '../assets/blogs.png'
import settings from '../assets/settings.png'
import authentication from '../assets/shield.png'

const sideNavData = [
  {
    id: 1,
    icon: Depatments,
    label: "Dashboard",
    hasDropdown: true,
    route: "/"
  },
  {
    id: 2,
    icon: student,
    label: "Students",
    hasDropdown: true,
    route: "/student"

  },
  {
    id: 3,
    icon: teacher,
    label: "Teachers",
    hasDropdown: true,
    route: "/teacher"

  },
  {
    id: 4,
    icon: Depatments,
    label: "Departments",
    hasDropdown: true,
    route: "/departments"

  },
  {
    id: 5,
    icon: subjects,
    label: "Subjects",
    hasDropdown: true,
    route: "/subjects"

  },
  {
    id: 6,
    icon: invoices,
    label: "Invoices",
    hasDropdown: true,
    route: "/invoices"

  },
  {
    id: 7,
    icon: account,
    label: "Accounts",
    hasDropdown: true,
    title: 'Management',
    route: "/account"

  },
  {
    id: 8,
    icon: holiday,
    label: "Holiday",
    hasDropdown: false,
    route: "/holiday"

  },
  {
    id: 9,
    icon: fees,
    label: "Fees",
    hasDropdown: false,
    route: "/fees"

  },
  {
    id: 10,
    icon: exams,
    label: "Exam List",
    hasDropdown: false,
    route: "/examList"

  },
  {
    id: 11,
    icon: events,
    label: "Events",
    hasDropdown: false,
    route: "/events"

  },
  {
    id: 12,
    icon: timetable,
    label: "Timetables",
    hasDropdown: false,
    route: "/timetables"

  },
  {
    id: 13,
    icon: library,
    label: "Library",
    hasDropdown: false,
    route: "/library"

  },
  {
    id: 14,
    icon: blogs,
    label: "Blogs",
    hasDropdown: true,
    route: "/blogs"

  },
  {
    id: 15,
    icon: settings,
    label: "Settings",
    hasDropdown: false,
    route: "/settings"

  },
  {
    id: 16,
    icon: authentication,
    label: "Authentication",
    hasDropdown: true,
    title: 'Pages',
    route: "/authentication"

  },
];

export default sideNavData;  