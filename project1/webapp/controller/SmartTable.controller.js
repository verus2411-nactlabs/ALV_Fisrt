sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/comp/sample/smarttable/mockserver/DemoMockServer"
], function (Controller, ODataModel, DemoMockServer) {
	"use strict";

	return Controller.extend("project1.SmartTable", {
		onInit: function () {
			this._oMockServer = new DemoMockServer();

			const oModel = new ODataModel(this._oMockServer.getServiceUrl(), {
				defaultCountMode: "Inline"
			});

			const oView = this.getView();
			oView.setModel(oModel);
		},
		onBeforeExport: function (oEvt) {
			const mExcelSettings = oEvt.getParameter("exportSettings");
			// GW export
			if (mExcelSettings.url) {
				return;
			}
			// For UI5 Client Export --> The settings contains sap.ui.export.SpreadSheet relevant settings that be used to modify the output of excel

			// Disable Worker as Mockserver is used in Demokit sample --> Do not use this for real applications!
			mExcelSettings.worker = false;
		},
		onExit: function () {
			this._oMockServer.destroy();
		},
		onDelete: function () {
			const oTable = this.byId("LineItemsSmartTable").getTable();
			const aSelectedIndices = oTable.getSelectedIndices();

			if (aSelectedIndices.length > 0) {
				const oModel = oTable.getModel();
				let iSuccessCount = 0;
				let iFailCount = 0;

				aSelectedIndices.forEach(function (iIndex) {
					const oContext = oTable.getContextByIndex(iIndex);
					const sPath = oContext.getPath();

					oModel.remove(sPath, {
						success: function () {
							iSuccessCount++;
							if (iSuccessCount + iFailCount === aSelectedIndices.length) {
								sap.m.MessageToast.show(iSuccessCount + " item(s) deleted successfully.");

								// 👉 Sau khi tất cả đã xử lý xong thì refresh lại table
								oModel.refresh(); // hoặc smartTable.rebindTable();
							}
						},
						error: function () {
							iFailCount++;
							if (iSuccessCount + iFailCount === aSelectedIndices.length) {
								sap.m.MessageToast.show(iSuccessCount + " item(s) deleted, " + iFailCount + " failed.");

								// 👉 Dù có lỗi vẫn nên refresh lại UI
								oModel.refresh();
							}
						}
					});
				});
			} else {
				sap.m.MessageToast.show("Please select at least one item to delete.");
			}
		}

	});
});
