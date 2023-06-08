import React from 'react';
import sideNavData from '../data/sideBar';
import {NavLink} from 'react-router-dom';
import "../app.css"

const Sidebar = () => {
  // const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // const handleCloseSidebar = () => {
  //   setIsSidebarOpen(false);
  // };



  return (
    <div
      className={`side-bar flex flex-col overflow-hidden bg-white h-screen overflow-x-hidden clear-left px-10 py-6`
      // ${
      //   isSidebarOpen ? '' : 'hidden'
      // }`
    }
    >
      <div className="flex items-center mb-5 cursor-pointer">
        <img src="/logoImg.png" className="h-[4rem] pr-2" alt="img" />
        <h1 className="font-bold text-[2rem]">AIAXLearn</h1>
        {/* <button
          type="button"
          className="close pl-6 rounded-full"
          aria-label="Close"
          onClick={handleCloseSidebar}
        >
          <span className="" aria-hidden="true">
            &times;
          </span>
        </button> */}
      </div>

      <div className="overflow-y-auto scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <nav className='overflow-hidden'>
          <ul className='overflow-hidden'>
          {sideNavData.map((navItem) => (
            <>
                <p className="m-3 mt-4 uppercase text-gray-500">{navItem.title}</p>

              <NavLink to={navItem.route} key={navItem.id} className="flex items-center gap-2 py-2 text-lg hover:bg-slate-300 hover:cursor-pointer rounded-2xl pr-2">
                {/*<li
                  className="flex items-center gap-2 py-2 text-lg hover:bg-slate-300 hover:cursor-pointer rounded-2xl pr-2"
                >*/}
                  <img src={navItem.icon} alt={navItem.label} className="icon-image px-2" />
                  {navItem.label}
                  {navItem.hasDropdown && (
                    <span className="dropdown-icon ml-auto">
                      <img src="/dropdown.png" alt="icon" className='px-1'/>
                    </span>
                  )}  
                {/*</li>*/}
              </NavLink>
            </>

            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
