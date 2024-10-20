
import { filterData } from "./core.js";
import { sidebarContainer, headerElms } from "../config/constants.js";

/**
 * Gets the selected filters for types, colors, and genders.
 *
 * @function
 * @returns {Object} - Object containing arrays of selected types, colors and gender.
 */
const getSelectedFilters = () => {
    const selectedFilters = {
        types: [],
        colors: [],
        gender: ''
    };

    const filterMap = {
        types: ".sidebar__type-checkbox:checked",
        colors: ".sidebar__color-checkbox:checked",
    };

    Object.keys(filterMap).forEach(key => {
        sidebarContainer.querySelectorAll(filterMap[key]).forEach(el => {
            selectedFilters[key].push(el.value);
        });
    });

    const genderEl = sidebarContainer.querySelector(".sidebar__gender-radio:checked");
    if (genderEl) {
        selectedFilters.gender = genderEl.value;
    }

    return selectedFilters;
};

/**
 * Resets all filters by calling the `resetTypeFilter`, `resetColorFilter`, and `resetGenderFilter` functions and recalculate data.
 * 
 * @returns {void} - This function does not return any value.
 */
const resetAllFilters = async () => {
    resetTypeFilter();
    resetColorFilter();
    resetGenderFilter();
    await filterData();
};

/**
 * Resets the color filter and updates the displayed data based on the current filters.
 *
 * @async
 * @function resetColorFilterClick
 * @returns {Promise<void>} A promise that resolves when the data filtering is complete.
 */
const resetColorFilterClick = async () => {
    resetColorFilter();
    await filterData();
}

/**
 * Resets the color filter by unchecking all selected color checkboxes.
 * 
 * @returns {void} - This function does not return any value.
 */
const resetColorFilter = async () => {
    sidebarContainer.querySelectorAll(".sidebar__color-checkbox:checked").forEach((checkbox) => {
        checkbox.checked = false;
    });
};

/**
 * Resets the type filter and updates the displayed data based on the current filters.
 *
 * @async
 * @function resetTypeFilterClick
 * @returns {Promise<void>} A promise that resolves when the data filtering is complete.
 */
const resetTypeFilterClick = async () => {
    resetTypeFilter();
    await filterData();
}

/**
 * Resets the type filter by unchecking all selected type checkboxes.
 * 
 * @returns {void} - This function does not return any value.
 */
const resetTypeFilter = () => {
    sidebarContainer.querySelectorAll(".sidebar__type-checkbox:checked").forEach((checkbox) => {
        checkbox.checked = false;
    });
};

/**
 * Resets the gender filter and updates the displayed data based on the current filters.
 *
 * @async
 * @function resetGenderFilterClick
 * @returns {Promise<void>} A promise that resolves when the data filtering is complete.
 */
const resetGenderFilterClick = async () => {
    resetGenderFilter();
    await filterData();
}

/**
 * Resets the gender filter by selecting the "all" radio button and ensuring that no other gender radio buttons are selected.
 * 
 * @returns {void} - This function does not return any value.
 */
const resetGenderFilter = async () => {
    const allRadioButton = sidebarContainer.querySelector(".sidebar__gender-radio[id='all']");
    if (allRadioButton) {
        allRadioButton.checked = true;
    }
};

/**
 * Resets the search box and refilter.
 * 
 * @returns {void} - This function does not return any value.
 */
const resetSearchBoxFilter = () => {
    headerElms.searchInput.value = '';
    headerElms.resetSearchBox.classList.remove('header__search-cross--visible');
    filterData();
};

/**
 * Show filters box in mobile.
 * 
 * @returns {void} - This function does not return any value.
 */
const showFilters = () => {
    sidebarContainer.classList.add('sidebar--visible');
};

/**
 * Close sidebar in mobile.
 * 
 * @returns {void} - This function does not return any value.
 */
const closeFilters = () => {
    sidebarContainer.classList.remove('sidebar--visible');
};


export { getSelectedFilters, resetAllFilters, resetColorFilterClick, resetColorFilter, resetTypeFilterClick, resetTypeFilter, resetGenderFilterClick, resetGenderFilter, resetSearchBoxFilter, showFilters, closeFilters };