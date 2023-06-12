var app = angular.module('myApp', []);
app.controller('AppCtrl', function ($scope, $window) {
    $scope.isLogin = false;
    $scope.imageSrc = '';
    $scope.imageProduct = '';
    $scope.datas = [];
    $scope.datas_products = [];
    $scope.productId = '';
    $scope.carts = [];

    if (sessionStorage.getItem('login')) {
        $scope.isLogin = true;
        $scope.info = angular.fromJson(sessionStorage.getItem('login'));
    }
    if (localStorage.getItem('user-list')) {
        $scope.datas = angular.fromJson(localStorage.getItem('user-list'));
    }
    if (localStorage.getItem('product-list')) {
        $scope.datas_products = angular.fromJson(localStorage.getItem('product-list'));
    }
    if (localStorage.getItem('productId')) {
        $scope.productId = angular.fromJson(localStorage.getItem('productId'));
    }
    if (localStorage.getItem('cart-list')) {
        $scope.carts = angular.fromJson(localStorage.getItem('cart-list'));
    }

    // =============== User =============================
    $scope.addUser = function () {
        var fileInput = document.getElementById('avatar');
        var file = fileInput.files[0]; // Lấy tệp đã chọn
        if (file) {
            // Tiến hành xử lý tệp ở đây
            $scope.imageSrc = '../assets/img/' + file.name;
        }

        var user = {
            name: $scope.name,
            imageName: $scope.imageSrc,
            email: $scope.email,
            password: $scope.password
        };
        $scope.datas.push(user)

        user = null;
        localStorage.setItem('user-list', angular.toJson($scope.datas));
        console.log($scope.datas);
        $window.alert('Thêm thành công!');
        $window.location.href = `/pages/sign-in.html`

    }
    $scope.isFormValid = function () {
        return $scope.name && $scope.email && $scope.password;
    };
    $scope.isFormValidUpdate = function () {
        return $scope.updatedUser.name && $scope.updatedUser.email && $scope.updatedUser.passwordOld && $scope.updatedUser.passwordNew;
    };

    $scope.login = function () {
        var user = check_login($scope.email, $scope.password);
        if (user) {
            // luu thong tin user vao sessionStorage
            sessionStorage.setItem('login', angular.toJson(user));

            window.location.href = "/index.html";
            $scope.isLogin = true;
            $scope.info = user
        }
        else {
            $scope.isLogin = false;
            $window.alert('thông tin tài khoản không hợp lệ');
        }


    }
    function check_login(email, pass) {
        // kiểm tra phần tử data email và password có đúng với 2 tham số truyền vào hay không
        for (var i = 0; i < $scope.datas.length; i++) {
            if ($scope.datas[i].email == email && $scope.datas[i].password == pass) {
                return $scope.datas[i]; // nêu có thì trả về cả đối tượng tìm thấy
            }
        }
        return false
    }
    $scope.logout = function () {
        sessionStorage.removeItem('login')
        $scope.isLogin = false;
        $scope.info = null;
        $scope.name = null;
        $scope.isLogin = false
    }

    $scope.remove_user = function (i) {
        // xóa 1 kể từ vị trí i đó
        $scope.datas.splice(i, 1)

        // cập nhật lại listUser
        localStorage.setItem('user-list', angular.toJson($scope.datas));
    }

    $scope.openEditModal = function (index, user) {
        // Gán dữ liệu người dùng cho đối tượng updatedUser
        console.log(index);

        $scope.updatedUser = angular.copy(user);
        console.log("mk ch thay đổi ")
        console.log($scope.updatedUser)

        // Mở modal
        var modalId = '#editModal' + index;
        $(modalId).modal('show');
    };


    $scope.updatedUsers = function (index) {
        console.log(index)

        var fileInput = document.getElementById('avatar2' + index);
        var file = fileInput.files[0];

        if (file) {
            // Tiến hành xử lý tệp ở đây
            $scope.imageSrc = '../assets/img/' + file.name;
        }

        var updatedUser = angular.copy($scope.updatedUser);
        // // Kiểm tra mật khẩu cũ

        var isValidPassword = (updatedUser.passwordOld === $scope.datas[index].password);

        if (!isValidPassword) {
            $window.alert('Mật khẩu cũ không chính xác.');
            return; // Kết thúc hàm nếu mật khẩu cũ không chính xác
        }
        else {
            $scope.datas[index].password = updatedUser.passwordNew
            $scope.datas[index].name = updatedUser.name;
            $scope.datas[index].email = updatedUser.email;
            $scope.datas[index].imageName = $scope.imageSrc;
            console.log("mk đã thay đổi")
            console.log($scope.datas[index])

            // Kiểm tra xem người dùng hiện tại có phải là $scope.info không
            if ($scope.info && $scope.info.email === $scope.datas[index].email) {
                $scope.info.name = updatedUser.name;
                $scope.info.email = updatedUser.email;
                $scope.info.password = updatedUser.passwordNew;
                $scope.info.imageName = $scope.imageSrc;

                sessionStorage.setItem('login', angular.toJson($scope.info));
            }
            // Cập nhật lại dữ liệu trong localStorage
            localStorage.setItem('user-list', angular.toJson($scope.datas));
            var modalId = '#editModal' + index;
            $window.alert('Cập Nhật Thành công');
            $(modalId).modal('hide');
        }


    };
    $scope.openDeleteModal = function (user) {
        $scope.userToDelete = user;
        $('#deleteModal').modal('show');
    };
    $scope.deleteUser = function () {
        //tìm vị trí của người dùng cần xóa trong mảng $scope.datas bằng cách sử dụng hàm indexOf
        var index = $scope.datas.indexOf($scope.userToDelete);
        //kiểm tra xem người dùng cần xóa có tồn tại trong mảng hay không
        if (index > -1) {
            $scope.datas.splice(index, 1);
            localStorage.setItem('user-list', angular.toJson($scope.datas));
        }
        $('#deleteModal').modal('hide');
    };

    $scope.customFilter = function (item) {
        if (!$scope.search) {
            return true; // Hiển thị tất cả các phần tử nếu không có giá trị tìm kiếm
        }

        var searchTerm = $scope.search.toLowerCase();
        var nameMatch = item.name.toLowerCase().includes(searchTerm);
        var emailMatch = item.email.toLowerCase().includes(searchTerm);
        return nameMatch || emailMatch;
    };
    $scope.view_user = function (item) {
        $scope.abc = item;
        $('#viewModal').modal('show');
    }



    // =============== Products =============================
    $scope.addProduct = function () {
        var fileInput = document.getElementById('products_avatar');
        var file = fileInput.files[0]; // Lấy tệp đã chọn
        if (file) {
            // Tiến hành xử lý tệp ở đây
            $scope.imageProduct = '../assets/img/' + file.name;
        }

        var product = {
            products_name: $scope.products_name,
            products_tacgia: $scope.products_tacgia,
            products_image: $scope.imageProduct,
            products_description: $scope.products_description,
            products_price: $scope.products_price
        };
        $scope.datas_products.push(product)

        product = null;
        localStorage.setItem('product-list', angular.toJson($scope.datas_products));
        console.log($scope.datas_products);
    }
    $scope.openProduct = function (index, product) {

        console.log(index);
        $scope.productId = angular.copy(product);
        console.log($scope.productId);
        localStorage.setItem('productId', angular.toJson($scope.productId));

    };
    $scope.openDeleteProducts = function (product) {
        $scope.productsToDelete = product;
        $('#deleteModal').modal('show');
    };
    $scope.deleteProducts = function () {
        //tìm vị trí của người dùng cần xóa trong mảng $scope.datas bằng cách sử dụng hàm indexOf
        var index = $scope.datas_products.indexOf($scope.productsToDelete);
        //kiểm tra xem người dùng cần xóa có tồn tại trong mảng hay không
        if (index > -1) {
            $scope.datas_products.splice(index, 1);
            localStorage.setItem('product-list', angular.toJson($scope.datas_products));
        }
        $('#deleteModal').modal('hide');
    };
    $scope.customProducts = function (item) {
        if (!$scope.search_products) {
            return true; // Hiển thị tất cả các phần tử nếu không có giá trị tìm kiếm
        }
        var searchTerm = $scope.search_products.toLowerCase();
        var nameMatch = item.products_name.toLowerCase().includes(searchTerm);
        var tacgiaMatch = item.products_tacgia.toLowerCase().includes(searchTerm);
        console.log(item.product_name)
        return nameMatch || tacgiaMatch;
    };
    $scope.view_Products = function (item) {
        $scope.def = item;
        $('#viewModal').modal('show');
    }
    $scope.openEditProduct = function (index, item) {
        // Gán dữ liệu người dùng cho đối tượng updated
        console.log(index);

        $scope.update = angular.copy(item);
        console.log( $scope.update)
    
        // Mở modal
        var modalId = '#editModal' + index;
        $(modalId).modal('show');
    };

    $scope.updateProducts = function (index) {
        console.log(index)

        var fileInput = document.getElementById('products_image' + index);
        var file = fileInput.files[0];

        if (file) {
            // Tiến hành xử lý tệp ở đây
            $scope.imageSrc = '../assets/img/' + file.name;
        }

        var update = angular.copy($scope.update);
        // // Kiểm tra mật khẩu cũ
        console.log(update)

       
       
     
            $scope.datas_products[index].products_name = update.products_name;
            console.log(update.products_name)
            $scope.datas_products[index].products_tacgia = update.products_tacgia;
            $scope.datas_products[index].products_description = update.products_description;
            $scope.datas_products[index].products_image = $scope.imageSrc;
            $scope.datas_products[index].products_price = update.products_price;
            
            console.log($scope.datas_products[index])

           
            // Cập nhật lại dữ liệu trong localStorage
            localStorage.setItem('product-list', angular.toJson($scope.datas_products));
            var modalId = '#editModal' + index;
            $window.alert('Cập Nhật Thành công');
            $(modalId).modal('hide');
       


    };



    // =============== CARTS =============================

    $scope.addToCart = function () {
        let quantity = document.querySelector('#quantity').value;

        // Kiểm tra kiểu dữ liệu của quantity
        if (typeof quantity === 'string') {
            // Kiểm tra nếu quantity là một chuỗi, hãy chuyển đổi nó thành số nguyên
            quantity = parseInt(quantity);
        }

        // Kiểm tra nếu quantity là một số nguyên
        if (Number.isInteger(quantity)) {
            $scope.productId.quantity = quantity;

            // Kiểm tra xem sản phẩm đã tồn tại trong carts chưa
            let existingProduct = $scope.carts.find(function (product) {
                return product.products_name === $scope.productId.products_name;
            });

            if (existingProduct) {
                // Nếu sản phẩm đã tồn tại, cộng giá trị quantity
                existingProduct.quantity += quantity;
            } else {
                // Nếu sản phẩm chưa tồn tại, thêm vào carts
                var Cart = angular.copy($scope.productId);
                $scope.carts.push(Cart);
            }

            localStorage.setItem('cart-list', angular.toJson($scope.carts));
            console.log($scope.carts);
        } else {
            console.log('Quantity must be an integer.');
        }
    }
    $scope.openDeleteCart = function (item) {
        $scope.CartToDelete = item;
        $('#deleteModal').modal('show');
    };

    $scope.deleteCart = function () {
        var index = $scope.carts.indexOf($scope.CartToDelete);
        if (index > -1) {
            $scope.carts.splice(index, 1);
            localStorage.setItem('cart-list', angular.toJson($scope.carts));
        }
        $('#deleteModal').modal('hide');
    };

    $scope.updatedCart = function (index) {
        console.log(index);
        let quantity = document.querySelector('#quantity' + index).value;
        if (typeof quantity === 'string') {
            quantity = parseInt(quantity);
        }
        $scope.carts[index].quantity = quantity;
        localStorage.setItem('cart-list', angular.toJson($scope.carts));
        console.log($scope.carts[index]);
        $scope.calculateTotalPrice();

    }
    $scope.calculateTotalPrice = function () {
        $scope.totalPrice = 0;
        for (let i = 0; i < $scope.carts.length; i++) {
            $scope.totalPrice += $scope.carts[i].products_price * $scope.carts[i].quantity;
        }
    }
    $scope.calculateTotalPrice();
});

