import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Form,
  Button,
  Select,
} from "antd";

import * as api from "../../../api";
import { setCategories } from "../../../redux/actions/category_actions";
import { setCurrencies, setRegions } from "../../../redux/actions/main_actions";
import DragAndDropUploader from "../drag_and_drop_uploader";
import CarAttributes from "../custom_attribute/car_attributes";
import { CustomAttributeField, NewCustomAttributeField } from "../custom_components";
import { DefaultInput, DefaultSelect } from "../default_input_fields";
import { useCategoriesTree } from "../../../hooks/category";
import { useEffectOnce } from "react-use";
import ReactModal from "react-modal";
import { ArrowDropDown, KeyboardArrowDown } from "@mui/icons-material";
import TreeView from "../tree_view";
import TagsInput from "../tags_input";
import { useUserStore } from "../../../store/user_store";

var DG = require('2gis-maps');

const Title = ({ title, isRequired, children }) => (
  <>
    <div className="flex flex-row items-center gap-2 mt-3">
      {isRequired ? <span className="text-red-500">*</span> : <></>}
      <span className="text-black text-[15px] font-normal">{title}</span>
    </div>
  </>
);

const HelpBlock = ({ children }) => (
  <span className="text-gray-500 text-[12px] mt-1 mb-3 gap-2 flex items-center">
    <i class="fas fa-info-circle"></i>
    <span>{children}</span>
  </span>
);

const ProductFields = ({ form, loading = false, onSend }) => {
  const dispatch = useDispatch();
  const userState = useUserStore();
  const categories = useCategoriesTree();

  const formRef = React.createRef();

  const { currencies, regions } = useSelector((state) => state.main);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCurrencyId, setSelectedCurrencyId] = useState(null);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [phones, setPhones] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const [files, setFiles] = useState([]);
  const [map, setMap] = useState(<div id="map" style={{ width: "100%", height: "400px" }}></div>);

  const setCategory = async (category) => {
    setSelectedCategory(category);
    const response = await api.fetchCategoryDetails(category.id);
    if (response != null) {
      setSelectedCategory(response);
    }
  }

  const fetchData = async () => {
    const currencies = await api.fetchCurrencies();
    if (currencies != null) {
      dispatch(setCurrencies(currencies));
      if (currencies.length) {
        if (form.getFieldValue("currency_id")) {
          const currency = currencies.find(o => o.id === form.getFieldValue("currency_id"));
          setSelectedCurrencyId(currency.id);
        } else {
          setSelectedCurrencyId(currencies[0].id);
        }
      }
    }
    const regions = await api.fetchRegions();
    if (regions != null) {
      dispatch(setRegions(regions));
      if (regions.length) {
        if (form.getFieldValue("region_id")) {
          const region = regions.find(o => o.id === form.getFieldValue("region_id"));
          selectRegion(region);
        } else {
          selectRegion(regions[0]);
        }
      }
    }
  };

  const selectRegion = (region) => {
    form.setFieldsValue({
      region_id: region.id
    });

    setCities(region.cities);
    if (region.cities != null && region.cities.length) {
      if (form.getFieldValue("city_id")) {
        const city = region.cities.find(o => o.id === form.getFieldValue("city_id"));
      } else {
        selectCity(region.cities[0]);
      }
    }
  };

  const selectCity = (city) => {
    form.setFieldsValue({
      city_id: city.id
    });
    setDistricts(city.districts);
  };

  useEffectOnce(() => {
    fetchData();

    var map;
    var marker;
    DG.then(function () {
      map = DG.map('map', {
        'center': [42.876, 74.607],
        'zoom': 13
      });
      DG.marker([42.876, 74.607]).addTo(map);
    });

  });

  const user = userState.user;

  return (
    <>
      <form
        ref={formRef}

      >
        <center>
          <Title title="Изображения" isRequired={true} />
          <HelpBlock>
            Вы можете загрузить до 10 фотографий.
            Максимальный размер изображения 2MB
          </HelpBlock>
          <DragAndDropUploader
            className="mb-3 p-2 rounded-2xl"
            style={{ maxWidth: 500 }}
            onChange={(file) => {
              setFiles([...files, file]);
            }}
            onRemove={(f) => {
              const index = files.indexOf(f);
              if (index !== -1) {
                const f = files.splice(index, 1);
                setFiles(f);
              }
            }}
          />
        </center>

        <Title title="Категория" isRequired={true} />
        <div
          onClick={() => {
            setCategoryModalOpen(true);
          }}
          className="flex flex-row items-center justify-between gap-2 mt-1 border rounded-[10px] p-0 m-0 cursor-pointer"
        >
          <span className="px-[20px] py-[10px] border-none focus:ring-0 rounded-tl-[10px] rounded-bl-[10px] text-primary m-0">
            {selectedCategory != null ? selectedCategory.name : "Выберите категорию"}
          </span>
          <span className="px-[20px] py-[10px] border-none focus:ring-0 rounded-tr-[10px] rounded-br-[10px] text-primary m-0">
            {selectedCategory != null ?
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-primary"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 1a9 9 0 100 18 9 9 0 000-18zm4.95 11.364a.682.682 0 01-.965.965L10 10.965l-4.95 4.364a.682.682 0 01-.965-.965L9.035 10 4.09 5.636a.682.682 0 01.965-.965L10 9.035l4.95-4.364a.682.682 0 01.965.965L10.965 10l4.95 4.364z"
                  clipRule="evenodd"
                />
              </svg>
              : <>
                <KeyboardArrowDown />
              </>
            }
          </span>
        </div>

        <Title title="Заголовок" isRequired={true} />
        <DefaultInput
          placeholder="Введите загаловок"
          className={"mt-1"}
        />

        <Title title="Цена" isRequired={true} />
        <div className="flex flex-row items-center  justify-between gap-2 mt-1 border rounded-[10px] p-0 m-0">
          <input type="text" placeholder="Цена" className="w-full border-none rounded-[10px] px-[20px] py-[10px] hover:border-[#184d9f] focus:border-[#184d9f] focus:ring-0" />
          <select
            className="px-[20px] py-[10px] border-none focus:ring-0 rounded-tr-[10px] rounded-br-[10px] bg-zinc-200 text-primary m-0"
            onChange={(e) => { setSelectedCurrencyId(e.target.value); }}
          >
            {currencies.map((item) => (
              <option value={item.id} selected={item.id === selectedCurrencyId}>{item.symbol}</option>
            ))}
          </select>
        </div>

        <Title title="Описание" isRequired={true} />
        <textarea
          placeholder="Введите описание"
          className="mt-1 border rounded-[10px] px-[20px] py-[10px] w-full h-[200px] resize-none"
        ></textarea>

        <Title title="Регион" isRequired={true} />
        <DefaultSelect
          placeholder="Выберите регион"
          value={null}
          className="mt-1"
        >
          {regions.map((item) => (
            <option value={item.id}>{item.name}</option>
          ))}
        </DefaultSelect>

        <Title title="Город" isRequired={true} />
        <DefaultSelect
          placeholder="Выберите город"
          value={null}
          className="mt-1"
        >
          {cities.map((item) => (
            <option value={item.id}>{item.name}</option>
          ))}
        </DefaultSelect>

        <Title title="Район" isRequired={false} />
        <TagsInput
          placeholder="Введите район"
          className="mt-1"
          options={districts.map((item) => item.name)}
          values={selectedDistrict != null ? [selectedDistrict] : []}
          onChange={(districts) => {
            const district = districts.pop();
            setSelectedDistrict(district);
          }}
        />

        {
          selectedCategory != null ?
            <>
              {selectedCategory.custom_attribute?.map((item) => (<>
                <Title title={item.title} isRequired={item.required} />
                <div className="mt-1">
                  <NewCustomAttributeField item={item} />
                </div>
              </>))}
              {selectedCategory.ca_groups?.map((group) => (
                <>
                  {group.attributes?.map((item) => (<>
                    <Title title={item.title} isRequired={item.required} />
                    <div className="mt-1">
                      <NewCustomAttributeField item={item} />
                    </div>
                  </>))}
                </>
              ))}
            </>
            :
            <>
            </>
        }

        <Title title="Кто может комментировать" isRequired={false} />
        <DefaultSelect placeholder="Кто может комментировать" value="all" className="mt-1">
          <option value="all">Все</option>
          <option value="none">Никто</option>
        </DefaultSelect>

        <Title title="Тел. номера" isRequired={true} />
        <TagsInput
          placeholder="Введите тел. номера"
          className="mt-1" options={user?.phone && !phones.includes(user.phone) ? [user.phone] : null}
          values={phones}
          onChange={(phones) => {
            setPhones(phones);
          }}
        />

        <Title title="Ссылка на видео" isRequired={false} />
        <DefaultInput
          placeholder="Введите ссылку на видео"
          className="mt-2.5"
        />

        <HelpBlock>
          Вставьте ссылку на видео с YouTube или с других видеохостингов.
        </HelpBlock>

        {selectedCategory != null && selectedCategory.kind === 'cars' ? (
          <>
            <hr />
            <h4>Дополнительные параметры</h4>
            <CarAttributes form={form} />
            <hr />
          </>
        ) : <></>
        }

        <div className="mt-[25px] mb-[14px] text-primary">Поставьте курсор на карте о местоположении товара или услуги</div>
        {map}
        {/* <Input type="text" value={JSON.stringify(location)} /> */}


        <center>
          <div
            className=" bg-blue-600 rounded-[5px] mt-[40px] mb-3 px-16 py-[10px] text-white hover:bg-blue-700 transition-colors duration-200 active:bg-blue-800"


            onClick={async () => {
              console.log('values', formRef.current);
            }}>
            Опубликовать
          </div>
        </center>
      </form>


      <CategorySelectModal
        isOpen={categoryModalOpen}
        onRequestClose={(item) => {
          if (item != null) {
            setCategory(item);
          }
          setCategoryModalOpen(false);
        }}
      />
    </>
  );
};

function CategorySelectModal({ isOpen, onRequestClose }) {
  const categories = useCategoriesTree();
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        overlay: {
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
        },
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          width: '90%',
          height: 600,
          maxWidth: 500,
          maxHeight: '90%',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          padding: 20,
          borderRadius: 10,
        },
      }}
    >
      <div className="flex flex-col h-full overflow-hidden">
        <h3 className="text-xl font-bold mb-3 flex-none">Выберите категорию</h3>

        <TreeView
          data={categories}
          className='flex-grow overflow-y-scroll'
          onSelect={(item) => {
            setSelectedCategory(item);
          }}
          value={selectedCategory?.id}
        />

        <div className="flex-none border-t border-gray-200 ">
          <div className="flex flex-row justify-end gap-2 p-3 w-full bg-white">
            <button
              className="btn btn-primary"
              onClick={() => {
                onRequestClose();
              }}
            >
              Отмена
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                onRequestClose(selectedCategory);
              }}
            >
              Выбрать
            </button>
          </div>
        </div>
      </div>
    </ReactModal >
  )
}

export default ProductFields;