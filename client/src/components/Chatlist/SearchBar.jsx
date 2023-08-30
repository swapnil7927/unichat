import { useStateContext } from '../../context/StateContext';
import { reducerCases } from '../../context/constants.js';
import { BiSearchAlt2 } from 'react-icons/bi';
import { BsFilter } from 'react-icons/bs';



const SearchBar = () => {

  const [{ contactSearch }, dispatch] = useStateContext();

  return (
    <div className="bg-search-input-container-background flex py-3 pl-5 items-center gap-3 h-14">
      <div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow">
        <div>
          <BiSearchAlt2
            className='text-panel-header-icon cursor-pointer text-xl'
          />
        </div>
        <div>
          <input
            type="text"
            placeholder='Search or start new chat'
            className='bg-transparent text-small focus:outline-none text-white flex-grow'
            value={contactSearch}
            onChange={(e) => dispatch({ type: reducerCases.SET_CONTACT_SEARCH, contactSearch: e.target.value })}
          />
        </div>
      </div>
      <div className='pr-5 pl-3'>
        <BsFilter
          className='text-panel-header-icon cursor-pointer text-xl'
        />
      </div>
    </div>
  );
}

export default SearchBar;
