import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import * as api from "../../../../api";
import { setCurrencies, setRegions } from "../../../../redux/actions/main_actions";
import DragAndDropUploader from "../../../components/drag_and_drop_uploader";
import CarAttributes from "../../../components/custom_attribute/car_attributes";
import { CustomAttributeField, NewCustomAttributeField } from "../../../components/custom_components";
import { DefaultInput, DefaultSelect, SearchableSelect } from "../../../components/default_input_fields";
import { useCategoriesTree } from "../../../../hooks/category";
import { useEffectOnce } from "react-use";
import ReactModal from "react-modal";
import { ArrowDropDown, KeyboardArrowDown } from "@mui/icons-material";
import TreeView from "../../../components/tree_view";
import TagsInput from "../../../components/tags_input";
import { useUserStore } from "../../../../store/user_store";
import JsonField from "../../../components/json_field";

var DG = require('2gis-maps');

const Title = ({ title, isRequired, children }) => (
  <div className="flex flex-row items-center gap-2 mt-3">
    {isRequired ? <span className="text-red-500">*</span> : <></>}
    <span className="text-black text-[15px] font-normal">{title}</span>
  </div>
);

const HelpBlock = ({ children }) => (
  <span className="text-gray-500 text-[12px] mt-1 mb-3 gap-2 flex items-center">
    <i className="fas fa-info-circle"></i>
    <span>{children}</span>
  </span>
);



const ProductFields = ({ loading = false, onSend }) => {
  const dispatch = useDispatch();
  const userState = useUserStore();
  const categories = useCategoriesTree();

  const formRef = React.createRef();

  const { currencies, regions } = useSelector((state) => state.main);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [phones, setPhones] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(undefined);

  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [selectedCurrencyId, setSelectedCurrencyId] = useState(undefined);
  const [selectedCategory, setSelectedCategory] = useState(undefined);
  const [description, setDescription] = useState("");
  const [regionId, setRegionId] = useState(undefined);
  const [cityId, setCityId] = useState(undefined);
  const [districtId, setDistrictId] = useState(undefined);
  const [canComment, setCanComment] = useState("all");
  const [customAttributes, setCustomAttributes] = useState([]);
  const [carAttributes, setCarAttributes] = useState({});
  const [location, setLocation] = useState(null);
  const [latitude,setLatitude] = useState();
  const [longitude,setLongitude] = useState();
  const [errors, setErrors] = useState({});

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
        if (selectedCurrencyId) {
          const currency = currencies.find(o => o.id === selectedCurrencyId);
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
        if (regionId) {
          const region = regions.find(o => o.id === regionId);
          selectRegion(region);
        } else {
          selectRegion(regions[0]);
        }
      }
    }
  };

  const selectRegion = (region) => {
    setRegionId(region.id);

    setCities(region.cities);
    if (region.cities != null && region.cities.length) {
      if (cityId) {
        const city = region.cities.find(o => o.id === cityId);
        selectCity(city);
      } else {
        selectCity(region.cities[0]);
      }
    }
  };

  const selectCity = (city) => {
    setCityId(city.id);
    setDistricts(city.districts);
  };

  useEffectOnce(() => {
    fetchData();
    navigator.geolocation.getCurrentPosition((position) => {
      let lat = position.coords.latitude;
      let long = position.coords.longitude;
      setLatitude(lat);
      setLongitude(long);
    });
    function getLocation(){
    var map;
    var marker;
    DG.then(function () {
      map = DG.map('map', {
        'center': [latitude != null ? latitude : 42.8746212, longitude != null ? longitude : 74.5697617],
        'zoom': 13
      });
      marker = DG.marker([latitude != null ? latitude : 42.8746212, longitude != null ? longitude : 74.5697617], {
        draggable: true
      }).addTo(map);
      marker.on('drag', function (e) {
        let lat = e.target._latlng.lat.toFixed(3);
        let lng = e.target._latlng.lng.toFixed(3);
        setLocation({ latitude: lat, longitude: lng });
      });
    });
  }
  setTimeout(getLocation,2000);

  });

  const user = userState.user;

  function checkAttributes(categories) {
    let attributes = [];
    categories.forEach((category) => {
      if (category.custom_attribute && category.custom_attribute.length > 0) {
        attributes.push({
          name: category.name,
          attributes: category.custom_attribute,
        });
      }
      if (category.ca_groups && category.ca_groups.length > 0) {
        attributes.push({
          name: category.name,
          attributes: category.ca_groups,
        });
      }
      if (category.children && category.children.length > 0) {
        attributes = attributes.concat(checkAttributes(category.children));
      }
    });

    return attributes;
  }

  function validate() {
    let errors = {};
    if (title.length === 0) {
      errors.title = "Заголовок не может быть пустым";
    }
    if (price.length === 0) {
      errors.price = "Цена не может быть пустой";
    }
    if (description.length === 0) {
      errors.description = "Описание не может быть пустым";
    }
    if (!regionId) {
      errors.regionId = "Регион не может быть пустым";
    }
    if (cityId == null) {
      errors.cityId = "Город не может быть пустым";
    }
    if (selectedCategory == null) {
      errors.selectedCategory = "Категория не может быть пустой";
    }
    if (phones.length === 0) {
      errors.phones = "Телефон не может быть пустым";
    }
    if (location == null) {
      errors.location = "Местоположение не может быть пустым";
    }
    if (selectedCategory != null && selectedCategory.custom_attribute?.length > 0) {
      selectedCategory.custom_attribute.forEach((item) => {
        if (item.required && customAttributes[item.name] === undefined) {
          errors[item.name] = "Поле не может быть пустым";
        }
      });
    }
    if (selectedCategory != null && selectedCategory.ca_groups?.length > 0) {
      selectedCategory.ca_groups?.forEach((group) => {
        group.attributes?.forEach((item) => {
          if (item.required && customAttributes[item.name] === undefined) {
            errors[item.name] = "Поле не может быть пустым";
          }
        });
      });
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  }

  const attributes = checkAttributes(categories);

  console.log('ca_groups.attributes', selectedCategory?.ca_groups?.map((group) => group));

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
          name="title"
          placeholder="Введите загаловок"
          className={"mt-1"}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          required={true}
          error={errors.title}
        />

        <Title title="Цена" isRequired={true} />
        <div className="flex flex-row items-center  justify-between gap-2 mt-1 border rounded-[10px] p-0 m-0">
          <input
            type="number"
            placeholder="Цена"
            className="w-full border-none rounded-[10px] px-[20px] py-[10px] hover:border-[#184d9f] focus:border-[#184d9f] focus:ring-0"
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
            }}
            required={true}
            error={errors.price}
          />
          <select
            className="px-[20px] py-[10px] border-none focus:ring-0 rounded-tr-[10px] rounded-br-[10px] bg-zinc-200 text-primary m-0"
            onChange={(e) => { setSelectedCurrencyId(e.target.value); }}
            value={selectedCurrencyId}

          >
            {currencies.map((item, index) => (
              <option
                key={index}
                value={item.id}>{item.symbol}</option>
            ))}
          </select>
        </div>

        <Title title="Описание" isRequired={true} />
        <textarea
          placeholder="Введите описание"
          className="mt-1 border rounded-[10px] px-[20px] py-[10px] w-full h-[200px] resize-none"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          required={true}
          error={errors.description}
        ></textarea>

        <Title title="Регион" isRequired={true} />
        <SearchableSelect
          name={"regionId"}
          placeholder="Выберите регион"
          value={regionId}
          onChange={(e) => {
            const region = regions.find(o => o.id === e);

            selectRegion(region);
          }}
          className="mt-1"
          options={regions.map((item) => ({ value: item.id, label: item.name }))}

        />

        <Title title="Город" isRequired={true} />
        <SearchableSelect
          name={"cityId"}
          placeholder="Выберите город"
          value={cityId}
          onChange={(e) => {
            const city = cities.find(o => o.id === e);

            selectCity(city);
          }}
          className="mt-1"
          options={cities.map((item) => ({ value: item.id, label: item.name }))}
        />

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
              {selectedCategory.custom_attribute?.map((item, index) => (<div key={index}>
                <Title title={item.title} isRequired={item.required} />
                <div className="mt-1">
                  <NewCustomAttributeField
                    item={item}
                    value={customAttributes[item.name]}
                    onChange={(value) => {
                      setCustomAttributes({ ...customAttributes, [item.name]: value });
                    }}
                  />
                </div>
              </div>))}

              {selectedCategory.ca_groups?.map((group, index) => (
                <div key={index}>
                  {group.attributes?.map((item, index) => (<div key={index}>
                    <Title title={item.title} isRequired={item.required} />
                    <div className="mt-1">
                      <NewCustomAttributeField
                        item={item}
                        value={customAttributes[item.name]}
                        onChange={(value) => {
                          setCustomAttributes({ ...customAttributes, [item.name]: value });
                        }}
                      />
                    </div>
                  </div>))}
                </div>
              ))}
            </>
            :
            <>
            </>
        }

        <Title title="Кто может комментировать" isRequired={false} />
        <DefaultSelect
          placeholder="Кто может комментировать"
          value={canComment}
          onChange={(e) => {
            setCanComment(e.target.value);
          }}
          className="mt-1"
        >
          <option value="all">Все</option>
          <option value="none">Никто</option>
        </DefaultSelect>

        <Title title="Тел. номера" isRequired={true} />
        <JsonField
          fields={[
            { title: "Номер телефона", key: "phone" },
          ]}
          className="mt-1"
          values={phones}
          onChange={(values) => {
            console.log('values', values);
            setPhones(values);
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
            <h4
              className="text-[15px] font-bold mt-[25px] mb-[14px] cursor-pointer"
            >Дополнительные параметры</h4>
            <CarAttributes
              type={carAttributes.type}
              mark={carAttributes.mark}
              model={carAttributes.model}
              generation={carAttributes.generation}
              series={carAttributes.series}
              modification={carAttributes.modification}
              characteristics={carAttributes.characteristics}
              onChange={(value) => {
                setCarAttributes(value);
              }}
            />
            <hr
              className="mt-[25px]"
            />
          </>
        ) : <></>
        }

        <div className="mt-[25px] mb-[14px] text-primary">Поставьте курсор на карте о местоположении товара или услуги</div>
        <div id="map" style={{ width: "100%", height: "400px" }}></div>

        <center>
          <div
            className=" bg-blue-600 rounded-[5px] mt-[40px] mb-3 px-16 py-[10px] text-white hover:bg-blue-700 transition-colors duration-200 active:bg-blue-800"
            onClick={async () => {
              if (!validate()) {
                console.log('validate', errors);
                for (let key in errors) {
                  const element = formRef.current.querySelector(`#${key}`);
                  if (element != null) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    break;
                  }
                }
                return;
              }

              const data = new FormData();

              if (files.length) {
                files.forEach((file) => {
                  data.append("images[]", file);
                });
              }

              data.append("title", title);
              data.append("price", price);
              data.append("currency_id", selectedCurrencyId);
              data.append("description", description);
              data.append("category_id", selectedCategory.id);
              data.append("region_id", regionId);
              data.append("city_id", cityId);
              data.append("district", districtId);
              data.append("can_comment", canComment);
              data.append("location", JSON.stringify(location));
              data.append("phones", JSON.stringify(
                phones.map((item) => item.value)
              ));

              let attributes = [];
              for (let key in customAttributes) {
                let allAttributes = [
                  ...selectedCategory.custom_attribute,
                  ...selectedCategory.ca_groups?.map((group) => group.attributes).flat(),
                ];

                const attribute = allAttributes.find(o => o.name === key);
                if (attribute != null) {
                  let extra = null;
                  if (attribute.type === 'RELATION') {
                    const values = JSON.parse(attribute.values);
                    if (values instanceof Object) {
                      extra = values['table'];
                    }
                  }

                  attributes.push({
                    attribute_id: attribute.id,
                    value: customAttributes[key],
                    type: attribute.type.toLowerCase(),
                    label: attribute.title ?? attribute.placeholder,
                    extra: extra,
                  });
                }
              }
              if (attributes.length) {
                data.append("custom_attribute_values", JSON.stringify(attributes));
              }

              console.log('attributes', attributes)

              if (selectedCategory.kind === 'cars') {
                data.append("car_attributes", JSON.stringify(carAttributes));
              }

              onSend(data);
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