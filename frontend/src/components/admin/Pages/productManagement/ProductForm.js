import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductManagement from './ProductManagement';
import getAllProducts from '../../../../reducers/apiReducer/productAPI/getAllProducts';
import './productManagement.css';
import { refreshTokenHandler } from '../../../../reducers/apiReducer/signFormAPI/refreshToken';
import { createProduct, updateProduct } from '../../../../reducers/apiReducer/productAPI/index';
import { toast } from "react-toastify";
import { showToastResult } from '../../../others/utilsAPI';
import 'react-toastify/dist/ReactToastify.css';


const ProductForm = () => {

    const selectedProduct = useSelector((state) => state.products.selected);
    const productList = useSelector((state) => state.getProducts.productsList);
    const categories = useSelector((state) => state.getCategories.categoriesList);
    const signInData = useSelector((state) => state.signIn.data);
    const privileged = signInData.user.privileged;

    const action = Object.keys(selectedProduct).length === 0 ? 'create' : 'update';
    const [change, setChange] = useState(false);
    const [bookID, setBookID] = useState('');
    const [bookName, setBookName] = useState(action === 'create' ? "" : selectedProduct.bookname);
    const [description, setDescription] = useState(action === 'create' ? "" : selectedProduct.description);
    const [category, setCategory] = useState(action === 'create' ? 'ngon_tinh' : selectedProduct.category);
    const [author, setAuthor] = useState(action === 'create' ? "" : selectedProduct.author);
    const [issuers, setIssuers] = useState(action === 'create' ? "" : selectedProduct.issuers);
    const [datePublic, setDatePublic] = useState(action === 'create' ? "" : selectedProduct.datePublic);
    const [supplier, setsupplier] = useState(action === 'create' ? "" : selectedProduct.supplier);
    const [bookSize, setBookSize] = useState(action === 'create' ? "" : selectedProduct.bookSize);
    const [pagesNumber, setPagesNumber] = useState(action === 'create' ? "" : selectedProduct.pagesNumber);
    const [sku, setSKU] = useState(action === 'create' ? "" : selectedProduct.sku);
    const [price, setPrice] = useState(action === 'create' ? "" : selectedProduct.price);
    const [discount, setDiscount] = useState(action === 'create' ? 0 : selectedProduct.discount);
    const [inStock, setInstock] = useState(action === 'create' ? 0 : selectedProduct.inStock);
    const [image, setImage] = useState(action === 'create' ? "" : selectedProduct.image);
    const [purchased, setPurchased] = useState(selectedProduct.purchased);

    const dispatch = useDispatch();

    function handleCancel() {
        let text = "Changes you made may not be saved\nEither OK or Cancel.";
        if (window.confirm(text) === true) {
            setChange(!change);
        }
    }

    function handleOnchangeOnSelect() {
        var x = document.getElementById("selectedCategory").value;
        setCategory(x);
        setBookID(createBookID);
    }

    function handleSetImage(e) {
        var temp = e.target.value;
        var fileName = temp.split(/(\\|\/)/g).pop(); // get name file
        var direct = `../images/book/${category}/${fileName}`;
        setImage(direct);
    }

    const validateProduct = (product) => {
        if (action === 'update') {
            if (product.bookname.trim() === '' || product.author.trim() === '' || product.price.toString().trim() === '' || product.image.trim() === '')
                return 'chưa nhập';
            if (product.price < 0 || product.inStock < 0 || product.purchased < 0)
                return 'số âm'
            return 'ok'
        }
        else {
            if (product.bookname.trim() === '' || product.author.trim() === '' || product.price.toString().trim() === '' || product.image.trim() === '')
                return 'chưa nhập';
            else if (product.price < 0 || product.inStock < 0 || product.purchased < 0)
                return 'số âm'
            else {
                for (let i = 0; i < productList.length; ++i) {
                    if (product.bookname.trim() === productList[i].bookname && product.author.trim() === productList[i].author) {
                        return 'Tồn tại';
                    }
                }
            }
            return 'ok';
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newAccess = await refreshTokenHandler(signInData.accessToken, dispatch);
        if (action === 'create') {
            var product = {
                bookid: createBookID(),
                bookname: bookName,
                price: parseInt(price),
                image,
                category: category,
                supplier: supplier,
                author: author,
                description: description,
                inStock: parseInt(inStock),
                issuers: issuers,
                datePublic: datePublic,
                bookSize: bookSize,
                coverType: 'Bìa cứng',
                pagesNumber: pagesNumber,
                sku: sku,
                bookMass: '',
            }
            const res = validateProduct(product);
            if (res === 'ok') {
                dispatch(getAllProducts.actions.addProduct({
                    bookid: createBookID(),
                    bookname: bookName,
                    price: parseInt(price),
                    image,
                    category: category,
                    supplier: supplier,
                    author: author,
                    description: description,
                    inStock: parseInt(inStock),
                    purchased: 0,
                    issuers: issuers,
                    datePublic: datePublic,
                    bookSize: bookSize,
                    coverType: 'Bìa cứng',
                    pagesNumber: pagesNumber,
                    sku: sku,
                    bookMass: '',
                    isAvailable: true,
                    _destroy: false,
                }));
                createProduct({ data: product, accessToken: newAccess });
                showToastResult({ type: 'success', content: 'Tạo sản phẩm thành công!!!' });

                setTimeout(() => {
                    setChange(!change)
                }, 2500);
            }
            else if (res === 'Tồn tại') {
                showToastResult({ type: 'error', content: 'Đã có sách này!!!' });
            }
            else if (res === 'số âm') {
                showToastResult({ type: 'warning', content: 'Nhập không hợp lệ!!!' });
                showToastResult({ type: 'info', content: 'trường giá, còn lại, đã mua không được âm!!!' });
            }
            else {
                showToastResult({ type: 'warning', content: 'Cần nhập các trường quy định!!!' });

            }
        }
        else {
            if (privileged.includes('ADM-U') || privileged.includes('ADM-P-U')) {
                var product = { ...selectedProduct };
                Object.assign(product, {
                    bookname: bookName, price: price, author: author, description: description, discount: discount,
                    bookSize: bookSize, issuers: issuers, supplier: supplier, purchased: purchased, inStock: inStock,
                });
                const res = validateProduct(product);
                if (res === 'ok') {
                    dispatch(getAllProducts.actions.updateProduct(product))
                    updateProduct({
                        bookid: product.bookid,
                        data: {
                            bookname: bookName, price: price, author: author, description: description, discount: discount,
                            bookSize: bookSize, issuers: issuers, supplier: supplier, purchased: purchased, inStock: inStock
                        },
                        accessToken: newAccess
                    });
                    showToastResult({ type: 'success', content: 'Sửa sản phẩm thành công!!!' });
                    setTimeout(() => {
                        setChange(!change)
                    }, 2500);
                }
                else if (res === 'chưa nhập') {
                    showToastResult({ type: 'warning', content: 'Cần nhập các trường quy định!!!' });
                }
                else if (res === 'số âm') {
                    showToastResult({ type: 'warning', content: 'Nhập không hợp lệ!!!' });
                    showToastResult({ type: 'info', content: 'trường giá, còn lại, đã mua không được âm!!!' });
                }
                else {
                    showToastResult({ type: 'error', content: 'Sửa không thành công, đã tồn tại sách!!!' });
                }
            }
            else {
                showToastResult({ type: 'error', content: 'Bạn không có quyền thực hiện hành động này!!!' });
            }
        }
    }

    function createBookID() {
        var bookid = '';
        var count = '';
        var temp = null;
        var max = 0;
        productList.map((product) => {
            if (product.category === category) {
                temp = product.bookid;
                for (let i = 0; i < temp.length; ++i) {
                    if (temp.charAt(i).match(/[0-9]/))
                        count += temp.charAt(i);
                }
                if (max < parseInt(count)) {
                    max = count;
                }
                count = '';
            }

        })
        if (temp === null) {
            bookid = category.charAt(0).toUpperCase();
            for (let i = 1; i < category.length; ++i) {
                if (category.charAt(i) === "_") {
                    bookid += category.charAt(i + 1).toUpperCase();
                }
            }
            var str = "" + 1
            var pad = "00"
            var ans = pad.substring(0, pad.length - str.length) + str
            bookid += ans;
            return bookid;
        }
        else {
            bookid = temp.slice(0, -(max.length));
            var str = "" + (parseInt(max) + 1);
            var pad = "00"
            var ans = pad.substring(0, pad.length - str.length) + str
            bookid += ans
            return bookid;
        }
    }

    return (
        <>
            {change === false ?
                <div className='panel-container'>
                    <div className='panel-form-form'>
                        <div className='panel-title'>Quản lý sách</div>
                        <div className='panel-form-title'> {action === 'create' ? 'Thêm' : 'Chỉnh sửa'} sách </div>
                        <form>
                            {action === 'create' ?
                                <>
                                    <div> Thể loại </div>
                                    <select id="selectedCategory" onChange={handleOnchangeOnSelect}>
                                        {categories.map((category) => {
                                            return (
                                                <option value={category.categoryId} key={category.categoryID}>{category.categoryID}</option>
                                            )
                                        })}
                                    </select>
                                    <div> Mã sách </div>
                                    <input disabled value={createBookID()} />
                                    <div> Tên sách <span id='required'>***</span> </div>
                                    <input onChange={(e) => { setBookName(e.target.value) }} required />
                                    <div> Chi tiết </div>
                                    <textarea style={{ minHeight: '100px', width: "100%", overflowY: "scroll" }} onChange={(e) => { setDescription(e.target.value) }}></textarea>
                                    <div> Tác giả <span id='required'>***</span></div>
                                    <input onChange={(e) => { setAuthor(e.target.value) }} required />
                                    <div> Nhà xuất bản </div>
                                    <input onChange={(e) => { setIssuers(e.target.value) }} />
                                    <div> Ngày xuất bản </div>
                                    <input onChange={(e) => { setDatePublic(e.target.value) }} />
                                    <div> Nhà cung cấp </div>
                                    <input onChange={(e) => { setsupplier(e.target.value) }} />
                                    <div> Kích cỡ sách </div>
                                    <input onChange={(e) => { setBookSize(e.target.value) }} />
                                    <div> Số trang sách </div>
                                    <input type={'number'} onChange={(e) => { setPagesNumber(e.target.value) }} />
                                    <div> Mã SKU </div>
                                    <input onChange={(e) => { setSKU(e.target.value) }} />
                                    <div> Giá sách <span id='required'>***</span></div>
                                    <input type={'number'} onChange={(e) => { setPrice(e.target.value) }} required />
                                    <div> Giảm giá </div>
                                    <input onChange={(e) => { setDiscount(e.target.value) }} />
                                    <div> Còn lại </div>
                                    <input onChange={(e) => { setInstock(e.target.value) }} />
                                    <div> Đã mua </div>
                                    <input value={0} disabled />
                                    <div> Đường dẫn ảnh <span id='required'>***</span></div>
                                    <input type={'file'} onChange={handleSetImage} required />
                                    <img src={image} alt={bookName} style={{ width: 200 + 'px', height: 240 + 'px' }} />
                                </>
                                :
                                <>
                                    <div> Thể loại </div>
                                    <input defaultValue={selectedProduct.category} disabled={true} />
                                    <div> Mã sách </div>
                                    <input defaultValue={selectedProduct.bookid} disabled={true} />
                                    <div> Tên sách <span id='required'>***</span> </div>
                                    <input defaultValue={selectedProduct.bookname} onChange={(e) => { setBookName(e.target.value) }} />
                                    <div> Chi tiết </div>
                                    <textarea defaultValue={selectedProduct.description} style={{ minHeight: '100px', width: "100%", overflowY: "scroll" }} onChange={(e) => { setDescription(e.target.value) }}></textarea>
                                    <div> Tác giả <span id='required'>***</span></div>
                                    <input defaultValue={selectedProduct.author} onChange={(e) => { setAuthor(e.target.value) }} />
                                    <div> Nhà xuất bản </div>
                                    <input defaultValue={selectedProduct.issuers} onChange={(e) => { setIssuers(e.target.value) }} />
                                    <div> Ngày xuất bản </div>
                                    <input defaultValue={selectedProduct.datePublic} onChange={(e) => { setDatePublic(e.target.value) }} />
                                    <div> Nhà cung cấp </div>
                                    <input defaultValue={selectedProduct.supplier} onChange={(e) => { setsupplier(e.target.value) }} />
                                    <div> Kích cỡ sách </div>
                                    <input defaultValue={selectedProduct.bookSize} onChange={(e) => { setBookSize(e.target.value) }} />
                                    <div> Số trang sách </div>
                                    <input type={'number'} defaultValue={selectedProduct.pagesNumber} onChange={(e) => { setPagesNumber(e.target.value) }} />
                                    <div> Mã SKU </div>
                                    <input defaultValue={selectedProduct.sku} onChange={(e) => { setSKU(e.target.value) }} />
                                    <div> Giá sách <span id='required'>***</span></div>
                                    <input type={'number'} defaultValue={selectedProduct.price} onChange={(e) => { setPrice(e.target.value) }} required />
                                    <div> Giảm giá </div>
                                    <input defaultValue={selectedProduct.discount} onChange={(e) => { setDiscount(e.target.value) }} />
                                    <div> Còn lại </div>
                                    <input defaultValue={selectedProduct.inStock} onChange={(e) => { setInstock(e.target.value) }} />
                                    <div> Đã mua </div>
                                    <input defaultValue={selectedProduct.purchased} onChange={(e) => { setPurchased(e.target.value) }} />
                                    <div> Đường dẫn ảnh <span id='required'>***</span></div>
                                    <input type={'file'} onChange={handleSetImage} />
                                    <img src={selectedProduct.image} alt={selectedProduct.bookname} style={{ width: 200 + 'px', height: 240 + 'px' }} />
                                </>
                            }
                            <div className='panel-form-btns'>
                                <button type='submit' className='btn btn-green' onClick={handleSubmit}> Xác nhận </button>
                                <button className='btn btn-red' onClick={handleCancel}> Hủy </button>
                            </div>
                        </form>
                    </div>
                </div>
                : <ProductManagement />}
        </>
    );
};

export default ProductForm;