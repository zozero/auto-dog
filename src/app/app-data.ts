export interface MyMenuItemType{
  icon: string;
  name: string;
}
export interface MyMenu {
  menu: MyMenuItemType;
  subMenuList: MyMenuItemType[];
}
