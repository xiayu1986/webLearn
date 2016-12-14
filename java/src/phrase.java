/**
 * Created by Administrator on 2016/12/14.
 */
public class phrase {
    public static void main(String[] args){
        //定义数组
        String[] listOne={"中","人","在","手","下"};
        String[] listTwo={"上","村","买","失","明"};
        String[] listThree={"昨","日","子","小","成"};
        //获取数组长度
        int lenOne=listOne.length;
        int lenTwo=listTwo.length;
        int lenThree=listThree.length;
        //生成随机数
        int randOne=(int) (Math.random() * lenOne);
        int randTwo=(int) (Math.random() * lenTwo);
        int randThree=(int) (Math.random() * lenThree);
        //生成随机语句
        String phrase=listOne[randOne]+listTwo[randTwo]+listThree[randThree];
        //输出
        System.out.println(phrase);
    }
}
