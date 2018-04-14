/********************************************************************
@Description :  Auto calcurate (精算単位, 精算単位あたりの超過及び控除金額) 
@Create      :  0.01 2017/08/XX  s.tsujiuchi   new
@Update      :  0.02 2017/10/12  s.tsujiuchi   change logic seican (line.15 ~ line.27)
                0.03 2017/11/02  s.tsujiuchi   change events (app.record.edit.change.seisan)
                0.04 2018/01/23  s.tsujiuchi   fixed bugs (6分,60分)
********************************************************************/

(function () {
    "use strict";
    
    var events = [
        'app.record.edit.change.seisan',
        'app.record.create.submit',
        'app.record.edit.submit',
        'app.record.index.edit.submit'
    ];

    kintone.events.on(events, function (event){
        var record = event.record;

        //---------------------------------------------------------------
        //  精算有無のselect内容に応じて、精算単位に値を自動入力
        //---------------------------------------------------------------        
        
        var seisan = record.seisan.value;
        var seisan_tani;
        
        if (seisan.indexOf("6分") != -1){
          seisan_tani = 6;
        }else if(seisan.indexOf("10") != -1){
          seisan_tani = 10;
        }else if(seisan.indexOf("15") != -1){
          seisan_tani = 15;
        }else if(seisan.indexOf("30") != -1){
          seisan_tani = 30;
        }else if(seisan.indexOf("60分") != -1){
          seisan_tani = 60;
        }else{
          seisan_tani = 30;
        }

        //精算単位をセット
        record.精算単位.value = seisan_tani;



        //---------------------------------------------------------------
        //  清算単位あたりの時給金額、超過金額、控除金額を計算
        //--------------------------------------------------------------- 
        var hour_price = record.受注時給金額_税抜.value;
        var cal = seisan_tani / 60;
            
        //上位関連-------------------------------------
            /* 精算単位における時給金額を計算*/
            var price_1h = record.受注時給金額_税抜.value;
            var price_1m = price_1h*cal;
            record.受注時給金額_税抜_m.value = price_1m;
            
        //エンジニア関連-------------------------------
            /* 精算単位における時給金額を計算*/
            var se_price_1h = record.発注時給金額.value;
            var se_price_1m = se_price_1h*cal;
            record.発注時給金額_税込_m.value = se_price_1m;
            
        
        //上位関連-------------------------------------
            var excess_price_1h = record.超過金.value;
            var deduct_price_1h = record.控除金.value;
    
            var excess_price_1m = excess_price_1h * seisan_tani/ 60;
            var deduct_price_1m = deduct_price_1h * seisan_tani / 60;
    
            record.超過金額_精算単位.value = excess_price_1m;
            record.控除金額_精算単位.value = deduct_price_1m;
    
        //エンジニア関連-------------------------------
            /* 精算単位あたりの超過及び控除金額を計算*/
            var se_excess_price_1h = record.超過金額_エンジニア.value;
            var se_deduct_price_1h = record.控除金額_エンジニア.value;

            var se_excess_price_1m = se_excess_price_1h * seisan_tani / 60;
            var se_deduct_price_1m = se_deduct_price_1h * seisan_tani / 60;
    
            record.超過金額_SE_精算単位.value = se_excess_price_1m;
            record.控除金額_SE_精算単位.value = se_deduct_price_1m;

        return event;
    });
})();
