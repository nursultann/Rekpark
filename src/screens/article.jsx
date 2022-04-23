import React from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

class Article extends React.Component {
    render() {
        return (
            <div>
                <Navbar />
                <div className="col-md-12">
                    <div className="row py-3 px-2">
                        <div className="col-md-8 shadow-sm">
                            <div className="col-md-12">
                                <img src="https://www.cnet.com/a/img/-qQkzFVyOPEoBRS7K5kKS0GFDvk=/940x0/2020/04/16/7d6d8ed2-e10c-4f91-b2dd-74fae951c6d8/bazaart-edit-app.jpg" width="100%" class="rounded" />
                                <label className="text-muted pt-3">Дата публикации:</label><label className="ml-5 text-muted pt-3" >Просмотры:</label>
                                <br />
                                <label style={{ fontSize: 24 }}>Тема Статьи</label>
                                <p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
                                    The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="col-md-12">
                                <label className="" style={{ fontSize: 20 }}>Другие новости</label>
                            </div>
                            <a class="nav-link" href="/article">
                                <div className="col-md-12 shadow-sm">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <img src="https://www.cnet.com/a/img/-qQkzFVyOPEoBRS7K5kKS0GFDvk=/940x0/2020/04/16/7d6d8ed2-e10c-4f91-b2dd-74fae951c6d8/bazaart-edit-app.jpg" width="100%" class="rounded" />
                                        </div>
                                        <div className="col-md-8">
                                            <label>Тема Статьи</label>
                                            <p style={{
                                                display: "-webkit-box",
                                                webkitLineClamp: "3",
                                                webkitBoxOrient: "vertical",
                                                overflow: "hidden"
                                            }}>
                                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                                            </p>
                                        </div>
                                    </div>
                                    <hr />
                                </div>
                            </a>

                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}
export default Article;