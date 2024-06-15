import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { JwtModule, JwtHelperService } from '@auth0/angular-jwt';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProductsComponent } from './components/products/products.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthService } from './services/authService/auth.service';
import { UserService } from './services/userService/user.service';
import { ProductService } from './services/productService/product.service';
import { CartService } from './services/cartService/cart.service';
import { DebitCardService } from './services/debitCardService/debitCard.service';
import { PaymentService } from './services/paymentService/payment.service';
import { AuthInterceptor } from './auth.interceptor';
import { ProfileComponent } from './components/profile/profile.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { CreditCardsComponent } from './components/credit-cards/credit-cards.component';
import { CartComponent } from './components/cart/cart.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OrdersComponent } from './components/orders/orders.component';

export function tokenGetter() {
  return localStorage.getItem('jwt_token');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ProductsComponent,
    NavbarComponent,
    ProfileComponent,
    AddProductComponent,
    ProductDetailsComponent,
    EditProductComponent,
    CreditCardsComponent,
    CartComponent,
    OrdersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatMenuModule,
    MatButtonModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:7039'],
        disallowedRoutes: ['http://localhost:7039/api/Auth/Login', 'http://localhost:7039/api/Auth/Register']
      }
    })
  ],
  providers: [
    AuthService,
    ProductService,
    UserService,
    DebitCardService,
    CartService,
    PaymentService,
    JwtHelperService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
