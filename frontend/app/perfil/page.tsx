export default function PerfilPage() {
    return (
        <div className="w-[100%] h-[100%] flex justify-center items-center bg-[#F9FAFB]">
            <div className="h-[750px] w-[869px]">
                <div className="bg-gradient-to-r from-[#9333EA] to-[#4338CA] h-[144px] w-[100%] flex p-[20px] items-center">
                    <div className="flex justify-center items-center gap-[20px] text-[#fff]">
                        <div className="shadow-md h-[80px] w-[80px] rounded-full bg-[#fff] flex justify-center items-center text-[36px] font-bold text-[#9333EA]">M</div>
                        <div>
                            <div className="text-[20px] font-bold">Millennium</div>
                            <p>Manage your store profile</p>
                        </div>
                    </div>
                </div>
                <div className="w-[100%] bg-[#fff]">
                    <div className="bg-[#FAF5FF]">
                        <div className="flex gap-[10px] items-center">
                            <img src="empresa.svg" alt="" />
                            <span className="text-[12px] text-[#6B7280]">Store Name</span>
                        </div>
                        <input type="text" />
                    </div>
                </div>
            </div>
        </div>
    );
}